# Contributing to SABR Logistics Manager

First off, thank you for considering contributing to SABR Logistics Manager! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. Be respectful, collaborative, and constructive in your interactions.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear, descriptive title**
- **Detailed description** of the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear, descriptive title**
- **Detailed description** of the proposed feature
- **Use case** - why would this be useful?
- **Possible implementation** (optional)
- **Mockups or examples** (if applicable)

### 🔨 Code Contributions

1. **Find an issue to work on**
   - Look for issues labeled `good first issue` or `help wanted`
   - Comment on the issue to let others know you're working on it

2. **Fork and create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Run `npm run dev` and test manually
   - Test on different screen sizes
   - Test in both light and dark modes
   - Ensure TypeScript compiles without errors: `npx tsc --noEmit`

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**

## Development Setup

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Setup Steps

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SABR-Logistics-Manager-for-NGOs.git
   cd SABR-Logistics-Manager-for-NGOs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file** (optional)
   ```bash
   cp .env.local.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production** (to test)
   ```bash
   npm run build
   npm run preview
   ```

## Pull Request Process

1. **Update documentation** - If you change functionality, update the README.md
2. **Follow code style** - Match the existing code formatting and structure
3. **Test thoroughly** - Ensure your changes work across browsers
4. **Write clear PR description**
   - What does this PR do?
   - What issue does it fix? (if applicable)
   - Screenshots/GIFs of UI changes
5. **Link related issues** - Use keywords like "Fixes #123" or "Closes #456"
6. **Be responsive** - Address review comments promptly

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] TypeScript types are properly defined
- [ ] Changes are tested in both light and dark mode
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No console errors or warnings
- [ ] Documentation is updated (if needed)
- [ ] Commit messages follow convention

## Style Guidelines

### TypeScript/React

- Use **functional components** with hooks
- Use **TypeScript** for all new code
- Prefer **const** over let
- Use **meaningful variable names**
- Extract reusable logic into **custom hooks**
- Keep components **small and focused**

### Code Formatting

```typescript
// ✅ Good
const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  // Clear, descriptive function name
};

// ❌ Avoid
const hs = (e: any) => {
  e.preventDefault();
  // Unclear naming and 'any' type
};
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `DashboardCard.tsx`)
- Utilities/Services: `camelCase.ts` (e.g., `aiService.ts`)
- Types: `camelCase.ts` or `types.ts`
- Hooks: `use*.ts` (e.g., `useTheme.ts`)

### Component Structure

```typescript
import React from 'react';
import { Icon } from './Icon';
import type { MyProps } from '../types';

interface ComponentProps {
  // Props interface
}

export const MyComponent: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();

  // Event handlers
  const handleClick = () => {
    // ...
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Styling

- Use **Tailwind CSS** utility classes
- Follow existing color scheme
- Ensure **dark mode** compatibility
- Keep **responsive** design in mind
- Use consistent spacing (multiples of 4)

```tsx
// ✅ Good - Responsive, dark mode aware
<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow md:p-6">

// ❌ Avoid - Fixed styles, no dark mode
<div style={{ padding: '20px', backgroundColor: 'white' }}>
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(inventory): add barcode scanning for item entry
fix(dashboard): correct donation trend chart data
docs(readme): update installation instructions
style(components): format code with prettier
refactor(services): extract AI logic into separate functions
```

## Questions?

Feel free to open an issue for any questions or reach out via GitHub Discussions!

---

**Thank you for contributing!** 🙏
