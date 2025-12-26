function showNotify(name) {
  const notification = document.createElement("div");
  notification.className = `fixed bottom-10 right-10 z-[200] px-6 py-4 
                             bg-white/80 backdrop-blur-xl border border-white/40 
                             rounded-2xl shadow-2xl flex items-center gap-3 
                             animate-bounce transition-all duration-500`;
  notification.innerHTML = `
      <span class="text-xl">👋</span>
      <p class="font-bold text-slate-800"> Say hi to ${name}!</p>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(20px)";
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

async function loadTalentDeck() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    const container = document.getElementById("deck-container");

    function renderCards(profiles) {
      const cardHTML = profiles
        .map((user) => {
          return `
          <div class="talent-card" data-gradient="${user.gradient}">
            <div class="talent-header" style="background: ${user.gradient}">
              <span class="lightning-bolt">⚡</span>
              <div class="avatar-ring">
                <img src="${user.avatar}" alt="${user.name}" width="100%">
              </div>
            </div>
            <div class="talent-body">
              <div class="flex items-center gap-2 mb-1">
                <h2 class="text-xl font-bold text-slate-800">${user.name}</h2>
                ${user.isPro ? '<span class="badge-pro">👑 Pro</span>' : ""}
              </div>
              <p class="text-slate-400 text-xs mb-4">${user.handle}</p>
              <p class="font-bold text-slate-800 text-sm mb-3">${user.role}</p>
              <div class="flex flex-wrap gap-2 mt-4">
                ${user.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
              </div>
              <div class="flex gap-2 mt-8">
                <button class="flex-1 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold btn-msg">Message</button>
                <button class="flex-1 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold btn-primary" data-name="${user.name}">Connect</button>
              </div>
            </div>
          </div>`;
        })
        .join("");

      container.innerHTML = cardHTML;

      const skills = document.querySelectorAll(".skill-tag");
      skills.forEach((skill) => {
        skill.addEventListener("click", () => skill.classList.toggle("active"));
      });

      const connectBtns = document.querySelectorAll(".btn-primary");
      connectBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const userName = btn.getAttribute("data-name");
          if (btn.textContent !== "Connected") {
            btn.textContent = "Connecting...";
            setTimeout(() => {
              btn.textContent = "Connected";
              btn.classList.remove("bg-slate-900");
              btn.classList.add("green");
              showNotify(userName);
            }, 1500);
          } else {
            btn.textContent = "Removing...";
            btn.classList.add("red");
            setTimeout(() => {
              btn.textContent = "Connect";
              btn.classList.remove("green");
              btn.classList.remove("red");
              btn.classList.add("bg-slate-900");
            }, 1500);
          }
        });
      });

      const cards = document.querySelectorAll(".talent-card");
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          const grad = card.getAttribute("data-gradient");
          document.body.style.background = `${grad}`;
        });
        card.addEventListener("mouseleave", () => {
          document.body.style.background = `radial-gradient(circle at top right, #f8fafc, #e2e8f0)`;
        });
      });

      const messageBtn = document.querySelectorAll(".btn-msg");
      messageBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
          const pop = new Audio("Utilities/pop-423717.mp3");
          pop.play();
        });
      });
    }

    renderCards(data.profiles);

    const searchInput = document.querySelector("#search-input");
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filteredData = data.profiles.filter((profile) => {
        const nameMatch = profile.name.toLowerCase().includes(term);
        const skillMatch = profile.skills.some((s) => s.toLowerCase().includes(term));
        return nameMatch || skillMatch;
      });
      renderCards(filteredData);
    });
  } catch (error) {
    console.error("System Error:", error);
  }
}

loadTalentDeck();
