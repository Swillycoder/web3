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
      document.getElementById("status").textContent = "";
    
      // Show the canvas
      const canvas = document.getElementById("myCanvas");
      canvas.style.display = "block";
    
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
  let x = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simple example: a moving square
    ctx.fillStyle = "blue";
    ctx.fillRect(x, 50, 50, 50);

    x += 2;
    if (x > canvas.width) x = -50;

    requestAnimationFrame(animate);
  }

  animate();
}
