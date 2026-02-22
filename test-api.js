const testArchitect = async () => {
    try {
        const res = await fetch("https://architect-x-peach.vercel.app/api/architect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                projectName: "Test",
                scale: "small",
                description: "A realtime chat app"
            })
        });
        const text = await res.text();
        console.log("Architect Status:", res.status);
        console.log("Architect Response:", text);
    } catch (e) {
        console.error("Architect Error:", e);
    }
};

const testIdeate = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/ideate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: "A massive chat app"
            })
        });
        const text = await res.text();
        console.log("Ideate Status:", res.status);
        console.log("Ideate Response:", text);
    } catch (e) {
        console.error("Ideate Error:", e);
    }
};

testArchitect().then(testIdeate);
