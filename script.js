// Replace this with your backend URL deployed on Render
const BACKEND_URL = "https://web3backend-ahbi.onrender.com";

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  try {
    // Request accounts
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const address = accounts[0];

    // Sign a message (could be anything, here a simple string)
    const message = "Please sign this message to verify your token balance.";
    const signature = await ethereum.request({
      method: "personal_sign",
      params: [message, address],
    });

    // Verify on backend
    const response = await fetch(`${BACKEND_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, message, signature }),
    });

    const result = await response.json();

    if (result.success) {
      document.getElementById("connectButton").style.display = "none";
      
      document.getElementById("status").textContent = "";
      
      // Show the canvas
      const canvas = document.getElementById("canvas");
      canvas.style.display = "block";

      document.getElementById("gatedContent").style.display = "block";
    
      // Run your canvas animation function
      runCanvasAnimation(canvas);
      
    } else {
      alert("❌ You do not have enough tokens to access this site.");
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting wallet or verifying token.");
  }
}

// Attach this to a button in your HTML:
// <button id="connectWalletBtn">Connect Wallet</button>

document.getElementById("connectButton").addEventListener("click", connectWallet);

function runCanvasAnimation(canvas) {
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.src = 'https://raw.githubusercontent.com/Swillycoder/web3/main/run_r.png';

  let x = 0;
  let frames = 0;
  const frameWidth = 36;
  const frameHeight = 36;
  const totalFrames = 4; // adjust if your sprite sheet has more frames

  // Wait until the image loads before animating
  image.onload = () => {
let frameCounter = 0;
const frameSpeed = 8; // Increase to slow down animation (higher = slower)

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,600,400);
    ctx.drawImage(
      image,
      frameWidth * frames, 0,
      frameWidth, frameHeight,
      x, 100,
      frameWidth, frameHeight
    );
  
    ctx.fillStyle = "orange";
    ctx.fillRect(x, 50, 50, 50);
    ctx.fillStyle = 'green'
    ctx.fillText('TANG', x, 75);
  
    x += 2;
    if (x > canvas.width) x = -frameWidth;
  
    frameCounter++;
    if (frameCounter >= frameSpeed) {
      frames++;
      if (frames >= totalFrames) frames = 0;
      frameCounter = 0;
    }
  
    requestAnimationFrame(animate);
  }
  animate();
}
