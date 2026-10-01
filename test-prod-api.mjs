async function testProd() {
  try {
    const res = await fetch("https://real-hr-ai.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ sender: "ai", text: "Sálem" }, { sender: "user", text: "Men keldim" }],
        candidateId: null
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}
testProd();
