// ========================================
// OUR LITTLE UNIVERSE — INTERACTIVE EDITION
// MUKESH & SADHANASRI
// ========================================

// 1. BACKGROUND MUSIC — use the single <audio> element in index.html.
const backgroundMusic = document.getElementById("backgroundMusic");
const musicControl = document.getElementById("musicControl");
let musicStarted = false;

if (backgroundMusic) {
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
    backgroundMusic.preload = "auto";
}

function syncMusicButton() {
    if (!musicControl || !backgroundMusic) return;
    const playing = !backgroundMusic.paused && !backgroundMusic.muted;
    musicControl.classList.toggle("playing", playing);
    musicControl.innerHTML = playing
        ? '<i class="fa-solid fa-music"></i>'
        : '<i class="fa-solid fa-volume-xmark"></i>';
    musicControl.setAttribute("aria-label", playing ? "Mute background music" : "Play or unmute background music");
}

function playBackgroundMusic() {
    if (!backgroundMusic || !backgroundMusic.paused) return;
    backgroundMusic.play().then(() => {
        musicStarted = true;
        syncMusicButton();
    }).catch(() => {
        // Most browsers require a visitor gesture before audible autoplay.
        syncMusicButton();
    });
}

if (backgroundMusic) {
    backgroundMusic.addEventListener("play", syncMusicButton);
    backgroundMusic.addEventListener("pause", syncMusicButton);
    backgroundMusic.addEventListener("volumechange", syncMusicButton);
    playBackgroundMusic();
}

function startMusicOnFirstInteraction() {
    if (!musicStarted) playBackgroundMusic();
}
document.addEventListener("pointerdown", startMusicOnFirstInteraction, { once: true });
document.addEventListener("keydown", startMusicOnFirstInteraction, { once: true });

if (musicControl && backgroundMusic) {
    musicControl.addEventListener("click", (event) => {
        event.stopPropagation();
        if (backgroundMusic.paused) {
            backgroundMusic.muted = false;
            playBackgroundMusic();
        } else {
            backgroundMusic.muted = !backgroundMusic.muted;
            syncMusicButton();
        }
    });
}

// 2. FLOATING HEARTS
const heartsContainer = document.getElementById("hearts-container");
function createHeart() {
    if (!heartsContainer) return;
    const heart = document.createElement("i");
    heart.className = "fa-solid fa-heart heart";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (12 + Math.random() * 20) + "px";
    heart.style.animationDuration = (5 + Math.random() * 7) + "s";
    heartsContainer.appendChild(heart);
    window.setTimeout(() => heart.remove(), 12000);
}
window.setInterval(createHeart, 850);

// 3. CHAPTER NAVIGATION
const chapterIds = ["birthday", "memories", "story", "reasons", "letter", "promises", "final"];
function goToChapter(id) {
    if (!chapterIds.includes(id)) return;
    document.querySelectorAll(".chapter-screen").forEach(section => {
        section.classList.toggle("active", section.id === id);
    });
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    if (id === "memories") startAutoSlide();
    else stopAutoSlide();
}

const birthdayNext = document.getElementById("birthday-next");
if (birthdayNext) birthdayNext.addEventListener("click", () => goToChapter("memories"));

document.querySelectorAll("[data-next]").forEach(button => {
    button.addEventListener("click", () => goToChapter(button.dataset.next));
});
document.querySelectorAll("[data-prev]").forEach(button => {
    button.addEventListener("click", () => goToChapter(button.dataset.prev));
});

// 4. OPEN THE FIRST SURPRISE
const openButton = document.getElementById("open-button");
const envelope = document.getElementById("envelope");
const openingScreen = document.getElementById("opening-screen");
const mainWebsite = document.getElementById("main-website");
if (openButton && envelope && openingScreen && mainWebsite) {
    openButton.addEventListener("click", () => {
        playBackgroundMusic();
        envelope.classList.add("open");
        openButton.disabled = true;
        openButton.innerHTML = "Opening your little universe ❤️";
        window.setTimeout(() => {
            openingScreen.style.transition = "opacity 1s ease";
            openingScreen.style.opacity = "0";
            window.setTimeout(() => {
                openingScreen.style.display = "none";
                mainWebsite.classList.remove("hidden");
                goToChapter("birthday");
            }, 1000);
        }, 1300);
    });
}

// 5. YOUR MEMORY COLLECTION — filenames stay the same.
const memories = [
    { image: "memory1.jpeg", title: "The Beginning ❤️", description: "Every beautiful journey starts somewhere." },
    { image: "memory2.jpeg", title: "My Favourite Person", description: "Somehow, you became my favourite part of every day." },
    { image: "memory3.jpeg", title: "Beautiful Moments", description: "Little moments that became precious memories." },
    { image: "memory4.jpeg", title: "My Happiness", description: "Your smile makes ordinary days special." },
    { image: "memory5.jpeg", title: "Together", description: "One year of memories, laughter and love." },
    { image: "memory6.jpeg", title: "My Safe Place", description: "Thank you for being someone I can trust." },
    { image: "memory7.jpeg", title: "Our Story", description: "And there are still so many pages to write." },
    { image: "memory8.jpeg", title: "Forever Memories", description: "I would choose these moments all over again." },
    { image: "memory9.jpeg", title: "My Sadhanasri", description: "You make my world a little more beautiful." },
    { image: "memory10.jpeg", title: "365 Days ❤️", description: "One year down. A lifetime of memories ahead." },
    { image: "memory11.jpeg", title: "365 Days ❤️", description: "Gonna stand with me lifelong." }
];

const memoryTrack = document.getElementById("memory-track");
const dotsContainer = document.getElementById("slider-dots");
const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prev-btn");
let currentSlide = 0;
let autoSlideTimer = null;

function createMemoryCards() {
    if (!memoryTrack || !dotsContainer) return;
    memoryTrack.innerHTML = "";
    dotsContainer.innerHTML = "";
    memories.forEach((memory, index) => {
        const card = document.createElement("div");
        card.className = "memory-card" + (index === 0 ? " active" : "");
        const polaroid = document.createElement("div");
        polaroid.className = "polaroid";
        const photoFrame = document.createElement("div");
        photoFrame.className = "photo-frame";
        const background = document.createElement("img");
        background.className = "photo-background";
        background.src = `assets/images/${memory.image}`;
        background.alt = "";
        const photo = document.createElement("img");
        photo.className = "memory-photo";
        photo.src = `assets/images/${memory.image}`;
        photo.alt = memory.title;
        photo.loading = index === 0 ? "eager" : "lazy";
        photo.onerror = () => {
            photoFrame.innerHTML = `<div class="photo-placeholder"><i class="fa-solid fa-image"></i><p>Photo not found</p><small>${memory.image}</small></div>`;
        };
        const caption = document.createElement("div");
        caption.className = "photo-caption";
        const title = document.createElement("h3");
        title.textContent = memory.title;
        const description = document.createElement("p");
        description.textContent = memory.description;
        caption.append(title, description);
        photoFrame.append(background, photo);
        polaroid.append(photoFrame, caption);
        card.appendChild(polaroid);
        memoryTrack.appendChild(card);

        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot" + (index === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Show memory ${index + 1}`);
        dot.addEventListener("click", () => { currentSlide = index; showSlide(currentSlide); resetAutoSlide(); });
        dotsContainer.appendChild(dot);
    });
}

function showSlide(index) {
    const cards = document.querySelectorAll(".memory-card");
    const dots = document.querySelectorAll(".slider-dots .dot");
    cards.forEach((card, i) => card.classList.toggle("active", i === index));
    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
        dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
}
function nextSlide() { currentSlide = (currentSlide + 1) % memories.length; showSlide(currentSlide); }
function previousSlide() { currentSlide = (currentSlide - 1 + memories.length) % memories.length; showSlide(currentSlide); }
function startAutoSlide() { stopAutoSlide(); autoSlideTimer = window.setInterval(nextSlide, 5000); }
function stopAutoSlide() { if (autoSlideTimer) { window.clearInterval(autoSlideTimer); autoSlideTimer = null; } }
function resetAutoSlide() { if (document.getElementById("memories")?.classList.contains("active")) startAutoSlide(); }
if (nextButton) nextButton.addEventListener("click", () => { nextSlide(); resetAutoSlide(); });
if (prevButton) prevButton.addEventListener("click", () => { previousSlide(); resetAutoSlide(); });
if (memoryTrack) {
    memoryTrack.addEventListener("mouseenter", stopAutoSlide);
    memoryTrack.addEventListener("mouseleave", resetAutoSlide);
}
createMemoryCards();

// 6. OUR STORY — show one story card at a time.
const storyCards = Array.from(document.querySelectorAll(".story-section .story-card"));
const storyNext = document.getElementById("story-next");
const storyStepNote = document.getElementById("story-step-note");
let currentStory = 0;
function showStory(index) {
    if (!storyCards.length) return;
    currentStory = index;
    storyCards.forEach((card, i) => card.classList.toggle("current-story", i === currentStory));
    if (storyStepNote) storyStepNote.textContent = `Part ${currentStory + 1} of ${storyCards.length}`;
    if (storyNext) storyNext.textContent = currentStory === storyCards.length - 1 ? "Discover why I love you →" : "Next part →";
}
if (storyNext) storyNext.addEventListener("click", () => {
    if (currentStory < storyCards.length - 1) showStory(currentStory + 1);
    else goToChapter("reasons");
});
showStory(0);

// 7. REASONS I LOVE YOU — tap each card to reveal its message.
const reasons = [
    ["Your heart", "I love the kindness and goodness in the person you are."],
    ["Your patience", "Even on difficult days, you try to understand me. I never want to take that for granted."],
    ["Your trust", "You let me be myself and make me feel that I don't have to hide my thoughts from you."],
    ["Your belief", "You believe in me, even when I struggle to believe in myself."],
    ["Your little efforts", "The thoughtful things you do, even when they seem small, mean more to me than I can explain."],
    ["Simply you", "Before anything else, I fell for your character. I love you for being you."]
];
const reasonGrid = document.getElementById("reason-grid");
if (reasonGrid) {
    reasons.forEach(([title, message], index) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "reason-card";
        card.innerHTML = `<span class="reason-front">A little reason ${index + 1} ♥</span><span class="reason-back"><strong>${title}</strong><br>${message}</span>`;
        card.setAttribute("aria-expanded", "false");
        card.addEventListener("click", () => {
            const revealed = card.classList.toggle("revealed");
            card.setAttribute("aria-expanded", String(revealed));
        });
        reasonGrid.appendChild(card);
    });
}

// 8. LOVE LETTER — expands to a readable, scrollable full-screen page.
const loveEnvelope = document.getElementById("love-envelope");
const openLoveLetter = document.getElementById("open-love-letter");
const closeLoveLetter = document.getElementById("close-love-letter");
const typedLetter = document.getElementById("typed-letter");
const lovePaper = document.getElementById("love-paper");
const letterHint = document.getElementById("letter-hint");
const letterText = "From our first WhatsApp conversations to the long calls that somehow never felt long enough, you became someone incredibly special to me. I never planned for any of this. I only knew that talking to you felt easy, and little by little, you became the person I wanted to tell everything to.\n\nI fell for your character before anything else — your heart, your patience, your honesty and the way you care. Thank you for trusting me, believing in me and accepting me as I am. I notice the little things you do for me, even the sacrifices you make when it is not easy. They mean more than I can ever put into words.\n\nI know I am not perfect. Sometimes I create unnecessary arguments or let my emotions hurt the person I love most. I am sorry for those moments. You deserve gentleness, respect, peace and a love that makes room for your dreams. I want to keep learning how to give you that — not just through words, but through my actions.\n\nPlease never stop being yourself. Keep chasing what makes you happy, keep growing, and never feel that you have to make yourself smaller for me. I want to stand beside you and cheer for the person you are becoming.\n\nHappy Birthday, my love. Thank you for making this past year so meaningful. If I could return to that very first conversation, knowing everything I know now, I would still choose to reply to you. And I would choose you again.";
let letterOpened = false;
let typingTimer = null;
let lovePaperPlaceholder = null;

function showLoveLetter() {
    if (!loveEnvelope || !lovePaper) return;
    loveEnvelope.classList.add("open");

    // Move the paper directly under <body>. This avoids transformed chapter
    // containers restricting position:fixed and shrinking the full-screen letter.
    if (!lovePaperPlaceholder) {
        lovePaperPlaceholder = document.createComment("love-letter-paper-position");
        lovePaper.parentNode.insertBefore(lovePaperPlaceholder, lovePaper);
    }
    document.body.appendChild(lovePaper);
    lovePaper.classList.add("is-fullscreen");
    document.body.classList.add("letter-is-open");
    document.body.style.overflow = "hidden";
    if (openLoveLetter) {
        openLoveLetter.textContent = "Your letter is open ❤️";
        openLoveLetter.disabled = true;
    }
    if (letterHint) letterHint.textContent = "Take your time. Every word is written for you.";
}

function hideLoveLetter() {
    if (!loveEnvelope || !lovePaper) return;
    loveEnvelope.classList.remove("open");
    lovePaper.classList.remove("is-fullscreen");
    if (lovePaperPlaceholder && lovePaperPlaceholder.parentNode) {
        lovePaperPlaceholder.parentNode.insertBefore(lovePaper, lovePaperPlaceholder);
        lovePaperPlaceholder.remove();
        lovePaperPlaceholder = null;
    }
    document.body.classList.remove("letter-is-open");
    document.body.style.overflow = "";
    if (openLoveLetter) {
        openLoveLetter.textContent = "Reopen Your Letter 💌";
        openLoveLetter.disabled = false;
    }
}

if (openLoveLetter && loveEnvelope && typedLetter) {
    openLoveLetter.addEventListener("click", () => {
        showLoveLetter();
        if (letterOpened) return;
        letterOpened = true;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let position = 0;
        const speed = reducedMotion ? 1 : 16;
        typingTimer = window.setInterval(() => {
            typedLetter.textContent = letterText.slice(0, position);
            position += 4;
            if (position > letterText.length) {
                typedLetter.textContent = letterText;
                window.clearInterval(typingTimer);
                typingTimer = null;
            }
            // Keep the newest typed lines visible while the letter is being written.
            if (lovePaper) lovePaper.scrollTop = lovePaper.scrollHeight;
        }, speed);
    });
}

if (closeLoveLetter) closeLoveLetter.addEventListener("click", hideLoveLetter);
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && loveEnvelope && loveEnvelope.classList.contains("open")) hideLoveLetter();
});

// 9. PROMISES — reveal one at a time.
const promises = [
    ["I promise to listen", "I will make space for your thoughts and feelings, even when they are different from mine."],
    ["I promise to support your dreams", "Your goals matter. I want to encourage you, celebrate your progress and stand beside you."],
    ["I promise to respect your individuality", "You will always have room to grow, explore, laugh and be completely yourself."],
    ["I promise to keep learning", "When I make mistakes, I want to take responsibility, understand, and become better through my actions."],
    ["I promise to choose us with care", "Not only on easy days, but with patience, honesty, kindness and effort on the difficult ones too."]
];
const promiseCard = document.getElementById("promise-card");
const promiseProgress = document.getElementById("promise-progress");
const promiseNext = document.getElementById("promise-next");
let currentPromise = 0;
function showPromise(index) {
    currentPromise = index;
    const [title, message] = promises[currentPromise];
    if (promiseCard) promiseCard.innerHTML = `<span class="promise-number">PROMISE ${currentPromise + 1}</span><h3>${title}</h3><p>${message}</p>`;
    if (promiseProgress) promiseProgress.textContent = `Promise ${currentPromise + 1} of ${promises.length}`;
    if (promiseNext) promiseNext.textContent = currentPromise === promises.length - 1 ? "All my promises ❤️" : "Next promise →";
}
if (promiseNext) promiseNext.addEventListener("click", () => {
    if (currentPromise < promises.length - 1) showPromise(currentPromise + 1);
    else promiseNext.textContent = "And I mean every one ❤️";
});
showPromise(0);

// 10. REPLAY THE EXPERIENCE
const replayButton = document.getElementById("replay-surprise");
if (replayButton) replayButton.addEventListener("click", () => {
    resetProposal();
    currentSlide = 0;
    showSlide(0);
    showStory(0);
    showPromise(0);
    document.querySelectorAll(".reason-card").forEach(card => {
        card.classList.remove("revealed");
        card.setAttribute("aria-expanded", "false");
    });
    if (loveEnvelope) loveEnvelope.classList.remove("open");
    document.body.classList.remove("letter-is-open");
    if (typedLetter) typedLetter.textContent = "";
    if (openLoveLetter) { openLoveLetter.disabled = false; openLoveLetter.textContent = "Open Your Letter 💌"; }
    letterOpened = false;
    if (typingTimer) window.clearInterval(typingTimer);
    openingScreen.style.display = "";
    openingScreen.style.opacity = "1";
    envelope.classList.remove("open");
    openButton.disabled = false;
    openButton.innerHTML = 'Open Your Surprise <i class="fa-solid fa-heart"></i>';
    mainWebsite.classList.add("hidden");
    goToChapter("birthday");
    window.scrollTo({ top: 0, behavior: "smooth" });
});

console.log("Our Little Universe is ready ❤️");


// 11. FINAL PROPOSAL — YES opens a full-screen rose-petal and heart surprise.
const proposalYes = document.getElementById("proposal-yes");
const proposalNo = document.getElementById("proposal-no");
const proposalHint = document.getElementById("proposal-hint");
const proposalWrap = document.getElementById("proposal-wrap");
const proposalEnding = document.getElementById("proposal-ending");
const proposalClose = document.getElementById("proposal-close");
const petalHeartField = document.getElementById("petal-heart-field");
let proposalPetalTimer = null;

function createProposalPetal() {
    if (!petalHeartField) return;
    const item = document.createElement("span");
    const isHeart = Math.random() > 0.48;
    item.className = isHeart ? "proposal-floating-heart" : "proposal-floating-petal";
    item.textContent = isHeart ? "♥" : "🌹";
    item.style.left = `${Math.random() * 100}%`;
    item.style.setProperty("--drift", `${Math.round(Math.random() * 180 - 90)}px`);
    item.style.setProperty("--spin", `${Math.round(Math.random() * 540 - 270)}deg`);
    item.style.animationDuration = `${6 + Math.random() * 6}s`;
    item.style.fontSize = `${15 + Math.random() * 23}px`;
    petalHeartField.appendChild(item);
    window.setTimeout(() => item.remove(), 12500);
}

function openProposalEnding() {
    if (!proposalEnding) return;
    proposalEnding.classList.add("is-visible");
    proposalEnding.setAttribute("aria-hidden", "false");
    document.body.classList.add("proposal-is-open");
    document.body.style.overflow = "hidden";
    if (proposalWrap) proposalWrap.style.visibility = "hidden";
    if (proposalHint) proposalHint.textContent = "";
    if (proposalPetalTimer) window.clearInterval(proposalPetalTimer);
    for (let i = 0; i < 28; i++) window.setTimeout(createProposalPetal, i * 95);
    proposalPetalTimer = window.setInterval(createProposalPetal, 230);
    if (proposalClose) proposalClose.focus();
}

function closeProposalEnding() {
    if (!proposalEnding) return;
    proposalEnding.classList.remove("is-visible");
    proposalEnding.setAttribute("aria-hidden", "true");
    document.body.classList.remove("proposal-is-open");
    document.body.style.overflow = "";
    if (proposalWrap) proposalWrap.style.visibility = "";
    if (proposalPetalTimer) {
        window.clearInterval(proposalPetalTimer);
        proposalPetalTimer = null;
    }
    if (petalHeartField) petalHeartField.innerHTML = "";
    if (proposalYes) proposalYes.disabled = false;
    if (proposalYes) proposalYes.focus();
}

if (proposalNo) proposalNo.addEventListener("click", () => {
    if (proposalHint) proposalHint.textContent = "Hehe… only press YES ❤️";
});
if (proposalYes) proposalYes.addEventListener("click", openProposalEnding);
if (proposalClose) proposalClose.addEventListener("click", closeProposalEnding);
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && proposalEnding?.classList.contains("is-visible")) {
        closeProposalEnding();
    }
});

// Used by the website's replay button to return the final chapter to its question.
function resetProposal() {
    closeProposalEnding();
    if (proposalHint) proposalHint.textContent = "";
    if (proposalWrap) proposalWrap.style.visibility = "";
}
