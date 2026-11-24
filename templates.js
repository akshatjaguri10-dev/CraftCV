const RESUME_TEMPLATES = {
  classic: `
    <article id="resume" class="resume resume-classic">
      <div class="classic-header">
        <h1 id="p-name">Your Name</h1>
        <p id="p-contact" class="contact">email · phone · city</p>
      </div>
      <div id="s-summary" class="r-sec is-empty"><h3>Summary</h3><p id="p-summary"></p></div>
      <div id="s-education" class="r-sec is-empty"><h3>Education</h3><p id="p-education"></p></div>
      <div id="s-certifications" class="r-sec is-empty"><h3>Certifications</h3><p id="p-certifications"></p></div>
      <div id="s-skills" class="r-sec is-empty"><h3>Skills</h3><p id="p-skills"></p></div>
      <div id="s-projects" class="r-sec is-empty"><h3>Projects</h3><ul id="p-projects"></ul></div>
    </article>
  `,

  modern: `
    <article id="resume" class="resume resume-modern">
      <div class="modern-sidebar">
        <h1 id="p-name">Your Name</h1>
        <div id="p-contact" class="contact">email<br>phone<br>city</div>
        <div id="s-skills" class="r-sec is-empty"><h3>Skills</h3><p id="p-skills"></p></div>
        <div id="s-certifications" class="r-sec is-empty"><h3>Certifications</h3><p id="p-certifications"></p></div>
      </div>
      <div class="modern-main">
        <div id="s-summary" class="r-sec is-empty"><h3>Summary</h3><p id="p-summary"></p></div>
        <div id="s-education" class="r-sec is-empty"><h3>Education</h3><p id="p-education"></p></div>
        <div id="s-projects" class="r-sec is-empty"><h3>Projects</h3><ul id="p-projects"></ul></div>
      </div>
    </article>
  `,

  minimal: `
    <article id="resume" class="resume resume-minimal">
      <div class="min-header">
        <h1 id="p-name" class="min-name">Your Name</h1>
        <p id="p-contact" class="min-contact">email · phone · city</p>
      </div>
      <div id="s-summary" class="min-sec is-empty"><h3>Profile</h3><p id="p-summary"></p></div>
      <div id="s-education" class="min-sec is-empty"><h3>Education</h3><p id="p-education"></p></div>
      <div id="s-certifications" class="min-sec is-empty"><h3>Certifications</h3><p id="p-certifications"></p></div>
      <div id="s-skills" class="min-sec is-empty"><h3>Skills</h3><p id="p-skills"></p></div>
      <div id="s-projects" class="min-sec is-empty"><h3>Projects</h3><ul id="p-projects"></ul></div>
    </article>
  `
};