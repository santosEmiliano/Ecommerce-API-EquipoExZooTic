document.addEventListener("DOMContentLoaded", () => {
    const chatContainer = document.createElement("div");
    chatContainer.id = "chatbot-container";
    
    chatContainer.innerHTML = `
        <div id="chat-window" class="chat-window">
            <div class="chat-header">
                <div class="header-info">
                    <i class="fa-solid fa-robot"></i>
                    <span>Guía ExZooTic</span>
                </div>
                <button id="btn-close-chat" class="close-chat">&times;</button>
            </div>
            
            <div id="chat-messages" class="chat-messages">
                </div>

            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Pregunta sobre nuestros animales..." autocomplete="off">
                <button id="btn-send-chat">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>

        <button id="btn-chat-toggle" class="btn-flotante-chat" title="Asistente Virtual">
            <i class="fa-solid fa-comments"></i>
        </button>
    `;

    document.body.appendChild(chatContainer);

    const btnToggle = document.getElementById("btn-chat-toggle");
    const btnClose = document.getElementById("btn-close-chat");
    const chatWindow = document.getElementById("chat-window");
    const input = document.getElementById("chat-input");
    const btnSend = document.getElementById("btn-send-chat");
    const messagesContainer = document.getElementById("chat-messages");

    let localHistory = JSON.parse(localStorage.getItem('chat_history')) || [];

    const addMessage = (text, sender) => {
        const div = document.createElement("div");
        div.classList.add("message", sender === "user" ? "user-message" : "bot-message");
        
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        
        div.innerHTML = `<p>${formattedText}</p>`;
        messagesContainer.appendChild(div);
        
        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: "smooth"
        });
    };

    const toggleChat = () => {
        chatWindow.classList.toggle("mostrar-chat");
        if (chatWindow.classList.contains("mostrar-chat")) {
            input.focus();
        }
    };

    if (localHistory.length > 0) {
        localHistory.forEach(msg => {
            const sender = msg.role === 'user' ? 'user' : 'bot';
            const texto = msg.parts && msg.parts[0] ? msg.parts[0].text : "";
            if (texto) addMessage(texto, sender);
        });
    } else {
        addMessage("¡Hola explorador! 🌿 Soy tu guía virtual en ExZooTic. ¿Buscas algún animal en especial?", "bot");
    }

    const handleSend = async () => {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, "user");
        input.value = "";
        input.disabled = true;

        const loadingDiv = document.createElement("div");
        loadingDiv.classList.add("message", "bot-message");
        loadingDiv.innerHTML = `<p><i>Consultando guía... 🍃</i></p>`;
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch('https://72.60.228.244:3000/back/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    history: localHistory, 
                    message: text 
                })
            });

            const data = await response.json();

            messagesContainer.removeChild(loadingDiv);

            if (data.reply) {
                addMessage(data.reply, "bot");

                localHistory.push({ role: "user", parts: [{ text: text }] });
                localHistory.push({ role: "model", parts: [{ text: data.reply }] });
                localStorage.setItem('chat_history', JSON.stringify(localHistory));
            } else {
                addMessage("Hubo un error de comunicación 🔌", "bot");
            }

        } catch (error) {
            console.error("Error chatbot:", error);
            if(messagesContainer.contains(loadingDiv)) messagesContainer.removeChild(loadingDiv);
            addMessage("Lo siento, perdí la conexión con la base. Intenta de nuevo.", "bot");
        } finally {
            input.disabled = false;
            input.focus();
        }
    };

    btnToggle.addEventListener("click", toggleChat);

    btnClose.addEventListener("click", toggleChat);

    btnSend.addEventListener("click", handleSend);

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
    });

    document.addEventListener("click", (e) => {
        if (chatWindow.classList.contains("mostrar-chat")) {
            if (!chatWindow.contains(e.target) && !btnToggle.contains(e.target)) {
                toggleChat();
            }
        }
    });
});