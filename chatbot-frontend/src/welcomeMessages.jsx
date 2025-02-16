// welcomeMessages.js
const welcomeMessages = [
    "🤖 Did you know? Chatbots like me can respond to messages within milliseconds!",
    "💡 Pro Tip: Ask me anything—I'm here to help and have some fun along the way!",
    "🎉 Fun Fact: The first chatbot was created in 1966 and was called ELIZA.",
    "🚀 Suggestion: Try sending a voice message using the mic icon!",
    "🦄 Idea: Customize this chat to suit your own style and personality!",
    "🍕 Did you know? Pineapple on pizza is a controversial but tasty choice!",
  ];
  
  export const getRandomWelcomeMessage = () => {
    const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
    return welcomeMessages[randomIndex];
  };
  