// Portfolio JS
document.addEventListener('DOMContentLoaded', async () => {
  // Setup DB and Mock Tables
  try {
    await db.runSQL(`CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      tech TEXT,
      icon TEXT
    )`);
    await db.runSQL(`CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      content TEXT
    )`);

    // Seed projects
    const projs = await db.runSQL(`SELECT * FROM projects`);
    if (projs.length === 0) {
      await db.runSQL(`INSERT INTO projects (title, description, tech, icon) VALUES (?, ?, ?, ?)`, [
        "DOBEHA Portal",
        "Plataforma global de chat inteligente y automatización",
        "React, Node.js, SQLite",
        "💬"
      ]);
      await db.runSQL(`INSERT INTO projects (title, description, tech, icon) VALUES (?, ?, ?, ?)`, [
        "Cloud D1 Sync",
        "Middleware de sincronización cuántica de datos",
        "Cloudflare Workers, D1",
        "🔄"
      ]);
      await db.runSQL(`INSERT INTO projects (title, description, tech, icon) VALUES (?, ?, ?, ?)`, [
        "Neuro Canvas Engine",
        "Generador de partículas animadas y grafos con gravedad física",
        "HTML5 Canvas, TS",
        "🕸️"
      ]);
    }
  } catch(e) {
    console.error("DB Seed Error", e);
  }

  // Load and render projects
  const renderProjects = async () => {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const list = await db.runSQL(`SELECT * FROM projects`);
    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-img">${p.icon}</div>
        <div class="project-info">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div style="margin-top: 1rem; font-size: 0.8rem; color: #38bdf8; font-weight: 600;">${p.tech}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  };

  await renderProjects();

  // Contact form submission
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const content = document.getElementById('message').value;

      try {
        await db.runSQL(`INSERT INTO messages (name, email, content) VALUES (?, ?, ?)`, [name, email, content]);
        alert("¡Mensaje enviado con éxito y registrado en D1!");
        form.reset();
      } catch (err) {
        console.error(err);
        alert("Ocurrió un error al enviar el mensaje.");
      }
    });
  }
});