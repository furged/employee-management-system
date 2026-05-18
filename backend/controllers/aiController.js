const axios = require('axios');
const Employee = require('../models/Employee');

const getAIRecommendations = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const prompt = `Analyze this employee and provide:
    1. Promotion Recommendation (Yes/No with reason)
    2. Performance Feedback (detailed)
    3. Areas for Improvement
    4. Career Path Suggestion
    
    Employee Details:
    Name: ${employee.name}
    Department: ${employee.department}
    Skills: ${employee.skills.join(', ')}
    Performance Score: ${employee.performanceScore}/100
    Experience: ${employee.experience} years
    
    Provide response as JSON:
    {
      "promotionRecommendation": { "eligible": true/false, "reason": "..." },
      "feedback": "...",
      "improvementAreas": ["...", "..."],
      "careerSuggestion": "..."
    }`;
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    let aiResponse = response.data.choices[0].message.content;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      aiResponse = { feedback: aiResponse };
    }
    
    res.status(200).json({
      success: true,
      employee: employee.name,
      recommendations: aiResponse
    });
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(200).json({
      success: true,
      fallback: true,
      recommendations: {
        promotionRecommendation: { 
          eligible: employee.performanceScore >= 80, 
          reason: employee.performanceScore >= 80 ? "Excellent performance" : "Needs improvement" 
        },
        feedback: "AI service temporarily unavailable. Showing basic recommendation.",
        improvementAreas: ["Technical skills", "Communication"],
        careerSuggestion: "Continue developing skills"
      }
    });
  }
};

const getEmployeeRanking = async (req, res) => {
  try {
    const employees = await Employee.find();
    
    const prompt = `Rank these employees by performance and suitability for promotion.
    Employees: ${employees.map(e => `${e.name} (Score: ${e.performanceScore}, Dept: ${e.department}, Exp: ${e.experience} years)`).join('; ')}
    
    Return JSON: { "rankings": [{"name": "...", "rank": 1, "reason": "..."}], "topPick": "...", "summary": "..." }`;
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    let aiResponse = response.data.choices[0].message.content;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) aiResponse = JSON.parse(jsonMatch[0]);
    } catch (e) {
      aiResponse = { rankings: employees.map((e,i) => ({ name: e.name, rank: i+1, reason: "Based on performance" })) };
    }
    
    res.status(200).json({ success: true, ...aiResponse });
  } catch (error) {
    const employees = await Employee.find();
    const sorted = employees.sort((a,b) => b.performanceScore - a.performanceScore);
    res.status(200).json({
      success: true,
      fallback: true,
      rankings: sorted.map((e,i) => ({ name: e.name, rank: i+1, reason: "Based on performance score" })),
      topPick: sorted[0]?.name,
      summary: "Ranking based on performance scores"
    });
  }
};

const getTrainingSuggestions = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findById(employeeId);
    
    const prompt = `Suggest training courses for ${employee.name} in ${employee.department} department.
    Current skills: ${employee.skills.join(', ')}. Performance: ${employee.performanceScore}/100.
    
    Return JSON: { "courses": [{"name": "...", "platform": "...", "duration": "..."}], "priority": "...", "estimatedImpact": "..." }`;
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 600
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    let aiResponse = response.data.choices[0].message.content;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) aiResponse = JSON.parse(jsonMatch[0]);
    } catch (e) {
      aiResponse = { courses: [{ name: "Skill Enhancement", platform: "Online", duration: "4 weeks" }] };
    }
    
    res.status(200).json({ success: true, employee: employee.name, ...aiResponse });
  } catch (error) {
    res.status(200).json({
      success: true,
      fallback: true,
      courses: [{ name: "Professional Development", platform: "Various", duration: "Flexible" }],
      priority: "Medium",
      estimatedImpact: "Positive"
    });
  }
};

module.exports = { getAIRecommendations, getEmployeeRanking, getTrainingSuggestions };