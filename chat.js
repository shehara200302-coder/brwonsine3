function initChat() {
  const chatButton = document.getElementById('ChatButton') || document.getElementById('chatButton');
  const chatPopup = document.getElementById('ChatPopup') || document.getElementById('chatPopup');
  const chatClose = document.getElementById('ChatClose') || document.getElementById('chatClose');
  const chatInput = document.getElementById('ChatInput') || document.getElementById('chatInput');
  const chatSend = document.getElementById('ChatSend') || document.getElementById('chatSend');
  const chatMessages = document.getElementById('ChatMessages') || document.getElementById('chatMessages');

  if (!chatButton || !chatPopup) {
    return;
  }
  // This code for chat popup
  chatButton.addEventListener('click', function() {
    chatPopup.classList.add('ChatPopupOpen');
    if (chatInput) chatInput.focus();
  });

  if (chatClose) {
    chatClose.addEventListener('click', function() {
      chatPopup.classList.remove('ChatPopupOpen');
    });
  }
  // Close when we are clicking outside the chat box
  chatPopup.addEventListener('click', function(e) {
    if (e.target === chatPopup) {
      chatPopup.classList.remove('ChatPopupOpen');
    }
  });

  function sendMessage() {
    if (!chatInput || !chatMessages) return;
    const message = chatInput.value.trim();
    if (!message) return;

    const userMessage = document.createElement('div');
    userMessage.className = 'ChatMessage ChatMessageUser';
    userMessage.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(userMessage);

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      // To create user message bubble
      const botMessage = document.createElement('div');
      botMessage.className = 'ChatMessage ChatMessageBot';
      botMessage.innerHTML = '<p>Thank you for your message! Our team will get back to you soon.</p>';
      chatMessages.appendChild(botMessage);

      // To auto-scroll to latest message
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
  }

  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
  }

  if (chatInput) {
    //I added this to , send messages by pressing Enter key
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChat);
} else {
  initChat();
}
