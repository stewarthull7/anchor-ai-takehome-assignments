
# React Performance Optimization Challenge

## Overview

This challenge is a React application intentionally designed with performance bottlenecks and bugs. Your objective is to identify these issues and optimize the application's performance, enhancing its responsiveness and efficiency while preserving its core functionality.

The application has the following features:
1. **List of Items**: A list of items is displayed.
2. **Search Filter**: Typing into the search box filters the displayed items.
3. **Item Selection**: Clicking an item highlights it.
4. **Total Items Selected**: The number of highlighted items is displayed at the top of the page.
5. **Last Selected Item**: The ID of the last selected (highlighted) item is displayed at the top of the page.


## Getting Started

### Installation

1. **Create a new repository from this template**:
   - Click the "Use this template" button on the top right of this repository's page to create your own copy of the repository.
2. Clone your newly created repository to your local machine and install the dependencies.
   ```bash
   npm install
   ```

### Running the Application
```bash
npm run dev
```

## Your Task
Your primary tasks are as follows:

### Performance Optimization:
- Analyze and identify performance issues: Examine the codebase and use tools such as React DevTools or browser profiling to pinpoint bottlenecks.
- Implement optimizations: Refactor and enhance the application’s performance without changing its existing functionality. Focus on improving responsiveness, minimizing unnecessary renders, and ensuring a smoother user experience.

### Bug Fixes:
- **Fix Bug #1:** The "Last selected item ID" displays the incorrect ID. Ensure that the correct ID is shown when an item is clicked.
- **Fix Bug #2:** There is a noticeable delay between selecting an item and seeing the "Total Items Selected" and the highlighted item indicator. Optimize this process so that the display updates immediately upon selection.

### Documentation:
**Explain your optimizations:** Create a short document explaining the performance issues you identified and how you addressed them. Highlight the key changes and their impact on the application's efficiency.

## Submission Guidelines
1. Create your own repository by using this template.
2. Once you have completed the optimizations and bug fixes:
    - Open a PR in your own repository with the changes you've made.
    - Include a detailed explanation of the issues you fixed and their cause, the optimizations you made, and any tools or techniques you used in the process.
    - Share the link to your repository along with the pull request.
