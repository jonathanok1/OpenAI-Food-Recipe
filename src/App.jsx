import React, { useState } from "react";
import "./App.css";

// API Key
const API_KEY = import.meta.env.VITE_SECRET;

function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");

  async function callOpenAIAPI() {
    console.log("Calling the OpenAI API");

    const APIBody = {
      model: "text-davinci-003",
      prompt:
        "Give me directions to make something using these and tell me what recipe it is" +
        ingredients,
      temperature: 0,
      max_tokens: 1000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
        },
        body: JSON.stringify(APIBody),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        setRecipe(data.choices[0].text.trim());
      } else {
        throw new Error("No choices returned from the API");
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  }

  console.log(ingredients);

  return (
    <div>
      <div className="Header"></div>
      <div className="h1-container">
        <h1>Jonathan OpenAI Recipe Helper</h1>
      </div>
      <div className="App">
        <div>
          <textarea
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients separated by commas"
            cols={50}
            rows={10}
          />
        </div>
        <div>
          <button onClick={callOpenAIAPI}>Generate Recipe From OpenAI</button>
          {recipe !== "" ? <h3>{recipe}</h3> : null}
        </div>
      </div>
    </div>
  );
}

export default App;
