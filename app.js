const apiUrl = "https://54.235.36.149:8080"; // Change this if your backend is deployed elsewhere

// Submit Problem
const problemForm = document.getElementById("problem-form");
problemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const files = document.getElementById("files").files;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    try {
        const response = await fetch(`${apiUrl}/problems`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            alert("Problem submitted successfully!");
            loadProblems(); // Refresh the problem list
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (err) {
        console.error("Error submitting problem:", err);
    }
});

// Load Problems
async function loadProblems() {
    const problemList = document.getElementById("problem-list");
    problemList.innerHTML = "Loading...";

    try {
        const response = await fetch(`${apiUrl}/problems`);
        const problems = await response.json();

        problemList.innerHTML = "";
        problems.forEach((problem) => {
            const li = document.createElement("div");
            li.className = "problem-card";

            const problemHeader = document.createElement("div");
            problemHeader.className = "problem-header";
            const userIcon = document.createElement("img");
            userIcon.src = "https://via.placeholder.com/50"; // Placeholder for user profile picture
            userIcon.alt = "User Icon";
            userIcon.className = "user-icon";
            problemHeader.appendChild(userIcon);

            const problemTitle = document.createElement("h3");
            problemTitle.className = "problem-title";
            problemTitle.textContent = problem.title;
            problemHeader.appendChild(problemTitle);

            li.appendChild(problemHeader);

            const problemDescription = document.createElement("p");
            problemDescription.className = "problem-description";
            problemDescription.textContent = problem.description;
            li.appendChild(problemDescription);

            // File Links
            const files = problem.files || [];
            if (files.length > 0) {
                const fileLinks = document.createElement("div");
                fileLinks.className = "file-links";

                const fileHeading = document.createElement("h4");
                fileHeading.textContent = "Attached Files:";
                fileLinks.appendChild(fileHeading);

                const fileList = document.createElement("ul");
                files.forEach((file) => {
                    const fileLi = document.createElement("li");
                    const fileLink = document.createElement("a");
                    fileLink.href = `${apiUrl}/download/${file}`;
                    fileLink.textContent = file;
                    fileLink.target = "_blank";
                    fileLi.appendChild(fileLink);
                    fileList.appendChild(fileLi);
                });

                fileLinks.appendChild(fileList);
                li.appendChild(fileLinks);
            }

            problemList.appendChild(li);
        });
    } catch (err) {
        console.error("Error loading problems:", err);
        problemList.innerHTML = "Failed to load problems.";
    }
}


// Initial Load
loadProblems();
