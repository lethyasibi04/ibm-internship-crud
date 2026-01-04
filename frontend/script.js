const apiUrl = "http://localhost:3000/students";

// Load students when page opens
window.onload = fetchStudents;

// ----------------------
// Fetch all students
// ----------------------
function fetchStudents() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("studentList");
      list.innerHTML = ""; // clear table

      data.forEach(student => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${student.roll}</td>
          <td>${student.name}</td>
          <td>${student.department}</td>
          <td>${student.age}</td>
          <td>
            <button onclick="editStudent('${student.roll}')">Edit</button>
            <button onclick="deleteStudent('${student.roll}')">Delete</button>
          </td>
        `;
        list.appendChild(tr);
      });
    });
}

// ----------------------
// Add new student
// ----------------------
function addStudent() {
  const name = document.getElementById("name").value;
  const roll = document.getElementById("roll").value;
  const department = document.getElementById("department").value;
  const age = document.getElementById("age").value;

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, roll, department, age })
  })
  .then(res => res.json())
  .then(() => {
    fetchStudents(); // refresh table
    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("department").value = "";
    document.getElementById("age").value = "";
  })
  .catch(err => console.error(err));
}

// ----------------------
// Delete student
// ----------------------
function deleteStudent(roll) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  fetch(`${apiUrl}/${roll}`, { method: "DELETE" })
    .then(() => fetchStudents())
    .catch(err => console.error(err));
}

// ----------------------
// Edit student
// ----------------------
function editStudent(roll) {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const student = data.find(s => s.roll === roll);
      if (!student) return;

      const newName = prompt("Enter new name:", student.name);
      const newDept = prompt("Enter new department:", student.department);
      const newAge = prompt("Enter new age:", student.age);
      if (!newName || !newDept || !newAge) return;

      const updatedStudent = { roll, name: newName, department: newDept, age: newAge };

      fetch(`${apiUrl}/${roll}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent)
      })
      .then(() => fetchStudents())
      .catch(err => console.error(err));
    });
}
