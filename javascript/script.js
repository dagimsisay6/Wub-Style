document.addEventListener("DOMContentLoaded", function () {
  const carouselWrapper = document.querySelector(".view-collection-wrapper");
  const carousel = document.getElementById("carousel");
  const cards = document.querySelectorAll(".card");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  let currentIndex = 0;
  function initCarousel() {
    if (window.innerWidth <= 768) {
      // Mobile view - enable carousel
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";
      updateCarousel();
    } else {
      // Desktop view - disable carousel
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      cards.forEach((card) => {
        card.style.transform = "none";
        card.classList.add("active");
      });
    }
  }

  // Toggle menu for mobile
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });


  function updateCarousel() {
    cards.forEach((card, index) => {
      card.classList.toggle("active", index === currentIndex);
    });

    carousel.scrollTo({
      left: currentIndex * carousel.offsetWidth,
      behavior: "smooth",
    });
  }

  // Initialize on load
  initCarousel();
  // Event listeners
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
  });
  // Handle window resize
  window.addEventListener("resize", function () {
    initCarousel();
  });

  // Add touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      // Swipe left - next
      currentIndex = (currentIndex + 1) % cards.length;
      updateCarousel();
    } else if (touchEndX > touchStartX + threshold) {
      // Swipe right - previous
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCarousel();
    }
  }
});

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  const arrow = item.querySelector(".arrow");

  question.addEventListener("click", () => {
    answer.classList.toggle("open");
    arrow.classList.toggle("rotate");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");

  // Check initial scroll position
  if (window.scrollY === 0) {
    header.classList.add("at-top");
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      header.classList.remove("at-top");
    } else {
      header.classList.add("at-top");
    }
  });
});

let startupContext = "";
const messages = [
  {
    role: "system",
    content: `
You are an AI assistant for the startup "WubStyle". You should ONLY answer questions based on the startup information below, but you can use the information in a conversational way and you can answer greetings and pleasantries.
If a question is unrelated or off-topic, kindly say: "I'm only here to talk about WubStyle. Please ask something related to our startup."

Startup Information:
WubStyle is a youth-focused fashion brand founded in 2024 by Dagim Sisay.

Teams Name:
Dagim Sisay, Designer and Founder
Bereket Eshete, Fashion Visionary
Elyas Yenealem, Garment Production Lead.

We help solve the challenge of finding affordable, stylish, and eco-friendly clothing for Gen Z consumers.

Our offerings include:
- Sustainable streetwear made from recycled and organic materials
- Customizable fashion designs
- A virtual try-on tool powered by AI

Our team is made up of passionate designers and developers based in Addis Ababa, Ethiopia.

To support WubStyle, you can:
- Shop our clothing collection
- Share our brand on social media
- Contact us directly at support@wubstyle.com

Our vision is to lead the green fashion movement and inspire the next generation to dress with both purpose and style.
      `,
  },
];

// document.getElementById("send-btn").addEventListener("click", sendMessage);
// document.getElementById("chat-input").addEventListener("keydown", (e) => {
//   if (e.key === "Enter") sendMessage();
// });

document.querySelectorAll("#sample-questions button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("chat-input").value = btn.innerText;
    sendMessage();
  });
});

function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (!message) {
    appendMessage("bot", "Please enter a question.");
    return;
  }

  appendMessage("user", message);
  input.value = "";

  puter.ai
    .chat({
      messages: [
        { role: "system", content: startupContext },
        { role: "user", content: message },
      ],
    })
    .then((response) => {
      appendMessage("bot", response.message.content);
    })
    .catch((err) => {
      appendMessage("bot", "Oops, something went wrong!");
      console.error(err);
    });
}

function appendMessage(sender, text) {
  const chatArea = document.getElementById("chat-area");
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function addMessage(msg, isUser) {
  const messagesDiv = document.getElementById("messages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  if (isUser) {
    messageDiv.classList.add("user-message");
  }
  messageDiv.textContent = msg;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("input-message");
  const message = input.value.trim();
  if (message) {
    addMessage(message, true);
    input.value = "";
    messages.push({ content: message, role: "user" });

    if (typeof puter !== "undefined") {
      puter.ai
        .chat(messages)
        .then((response) => {
          const reply = response.message?.content || "⚠️ No response from AI.";
          addMessage(reply, false);
          messages.push({ content: reply, role: "assistant" });
        })
        .catch((error) => {
          console.error("AI response error:", error);
          addMessage("Error talking to AI.", false);
        });
    } else {
      addMessage("Puter SDK not loaded.", false);
    }
  } else {
    addMessage("Please enter a question before sending.", false);
  }
}
