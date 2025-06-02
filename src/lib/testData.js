// Test data for development and testing of transform utility
export const mockStructuredData = {
  structured_data: {
    solution_architect: {
      opt_task: "Customer Support Automation",
      use_case_summary: "Automate customer support responses using AI chatbots"
    },
    workload_params: {
      calls_per_day: 1000,
      avg_input_tokens: 150,
      avg_output_tokens: 100,
      current_model: "gpt-3.5-turbo",
      region: "us-east-1",
      latency_sla_ms: 500
    },
    architecture: [
      "1 - Email ingestion",
      "2 - Priority classification", 
      "3 - Response generation"
    ],
    cost_table: [
      {
        model_name: "claude-3-haiku",
        monthly_cost: 1200,
        p90_latency_ms: 320
      },
      {
        model_name: "gpt-3.5-turbo",
        monthly_cost: 1800,
        p90_latency_ms: 450
      },
      {
        model_name: "gpt-4",
        monthly_cost: 3600,
        p90_latency_ms: 800
      }
    ],
    ranked_models: [
      {
        model_name: "gpt-3.5-turbo",
        composite_score: 1.00,
        monthly_cost: 54000,
        p90_latency_ms: 350
      },
      {
        model_name: "claude-3-haiku",
        composite_score: 0.95,
        monthly_cost: 1200,
        p90_latency_ms: 320
      },
      {
        model_name: "gemini-pro",
        composite_score: 0.88,
        monthly_cost: 2200,
        p90_latency_ms: 280
      },
      {
        model_name: "gpt-4",
        composite_score: 0.82,
        monthly_cost: 3600,
        p90_latency_ms: 800
      },
      {
        model_name: "claude-3-sonnet",
        composite_score: 0.78,
        monthly_cost: 4800,
        p90_latency_ms: 420
      }
    ],
    roi_analysis: {
      current_model: "gpt-3.5-turbo",
      best_model: "claude-3-haiku",
      current_monthly_cost: 1800,
      optimized_monthly_cost: 1200,
      savings_per_month: 600,
      roi_percent: 33.33,
      payback_weeks: 2,
      process_name: "Customer Support Automation"
    },
    final_recommendation: "Switch to claude-3-haiku for 33% cost savings while maintaining performance requirements."
  }
};

// Function to simulate API response with structured data
export const simulateAPIResponse = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStructuredData);
    }, 1000);
  });
};

export default mockStructuredData; 