describe("GitHub Repo Kanban Board", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Завантажує деталі репозиторію та відображає Kanban board", () => {
    // Перехоплення запиту для отримання даних репозиторію
    cy.intercept("GET", "https://api.github.com/repos/facebook/react", {
      statusCode: 200,
      body: { stargazers_count: 1234 },
    }).as("getRepo");

    // Перехоплення запиту для отримання issues репозиторію
    cy.intercept("GET", "https://api.github.com/repos/facebook/react/issues", {
      statusCode: 200,
      body: [
        {
          id: 1,
          state: "open",
          assignee: null,
          number: 101,
          title: "Issue 1",
          created_at: "2025-02-15T00:00:00Z",
          comments: 5,
          user: { login: "user1" },
        },
        {
          id: 2,
          state: "open",
          assignee: { login: "assigned-user" },
          number: 102,
          title: "Issue 2",
          created_at: "2025-02-14T00:00:00Z",
          comments: 3,
          user: { login: "assigned-user" },
        },
        {
          id: 3,
          state: "closed",
          assignee: null,
          number: 103,
          title: "Issue 3",
          created_at: "2025-02-13T00:00:00Z",
          comments: 0,
          user: { login: "user3" },
        },
      ],
    }).as("getIssues");

    cy.get(
      'input[placeholder="Enter GitHub repo URL (e.g. https://github.com/facebook/react)"]'
    ).type("https://github.com/facebook/react");
    cy.contains("Load").click();

    cy.wait("@getRepo");
    cy.wait("@getIssues");

    // Перевірка посилання на профіль власника репозиторію
    cy.contains("facebook's Profile").should(
      "have.attr",
      "href",
      "https://github.com/facebook"
    );

    // Перевірка посилання на репозиторій
    cy.contains("facebook/react Repo").should(
      "have.attr",
      "href",
      "https://github.com/facebook/react"
    );

    // Перевірка відображення зірок у форматі "1.2K stars"
    cy.contains("1.2K stars").should("exist");

    // Перевірка відображення колон Kanban board
    cy.contains("ToDo").should("exist");
    cy.contains("In Progress").should("exist");
    cy.contains("Done").should("exist");

    // Перевірка, що картки із завданнями відображаються
    cy.contains("Issue 1").should("exist");
    cy.contains("Issue 2").should("exist");
    cy.contains("Issue 3").should("exist");
  });

  it("Не завантажує дані, якщо введено невірний URL", () => {
    cy.get(
      'input[placeholder="Enter GitHub repo URL (e.g. https://github.com/facebook/react)"]'
    ).type("invalid-url");
    cy.contains("Load").click();

    cy.get("a").should("not.exist");
    cy.contains("ToDo").should("not.exist");
    cy.contains("In Progress").should("not.exist");
    cy.contains("Done").should("not.exist");
  });
});
