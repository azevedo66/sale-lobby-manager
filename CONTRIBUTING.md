# Contributing Guidelines  

Follow these guidelines for branch naming and commit messages.

---

## Workflow  

1. **Create a Branch**  
   - Always create a new branch from `main` before starting work.  
   - Use descriptive names:  
     - `feature/<short-description>` → for new features  
     - `fix/<short-description>` → for bug fixes  
     - `docs/<short-description>` → for documentation updates  
     - `chore/<short-description>` → for tooling, CI, or maintenance  

   **Examples:**  
   - `feature/user-authentication`  
   - `fix/login-validation`  
   - `docs/api-guide`  
   - `chore/update-dependencies`  

2. **Make Changes & Commit**  
   - Keep commits focused and atomic (one logical change per commit).  
   - Follow the commit message guidelines below.

3. **Push Changes** 
    - Push your branch to GitHub when ready.

---

## Commit Message Guidelines  

Use **Conventional Commits**.  

```
<type>(<scope>): <short summary>
```

- **type** → describes the purpose of the change  
- **scope** → optional, what part of the project is affected  
- **summary** → imperative description, no period at the end  

**Allowed types:**  
- `feat`: A new feature  
- `fix`: A bug fix  
- `docs`: Documentation only changes  
- `style`: Formatting (no code logic)  
- `refactor`: Code changes that neither fix a bug nor add a feature  
- `test`: Adding or updating tests  
- `chore`: Maintenance tasks (build, CI, tooling, dependencies)  

**Examples:**  
- `feat(api): add user authentication endpoint`  
- `fix(ui): correct alignment issue in navbar`  
- `docs(readme): clarify installation steps`  
- `style(css): apply consistent button styles`  
- `refactor(core): simplify data processing logic`  
- `test(utils): add unit tests for date parser`  
- `chore(ci): update GitHub Actions workflow`