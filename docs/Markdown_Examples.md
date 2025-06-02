# Markdown Rendering in Chat Messages

The MessageBubble component now supports full markdown rendering with custom styling. Here are examples of how different markdown elements will appear:

## Supported Markdown Elements

### 1. Text Formatting
- **Bold text** renders with `font-semibold text-soft-navy`
- *Italic text* renders with `italic`
- `Inline code` renders with gray background and monospace font

### 2. Headers
```markdown
# H1 Header
## H2 Header  
### H3 Header
```

### 3. Lists
```markdown
• Unordered list item 1
• Unordered list item 2
  - Nested items work too

1. Ordered list item 1
2. Ordered list item 2
```

### 4. Code Blocks
```markdown
```javascript
const example = "code block";
console.log(example);
```
```

### 5. Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### 6. Links
```markdown
[Visit our docs](https://example.com)
```

## Example Chat Message Content

Here's an example of what a typical AI response might look like:

```markdown
## 📊 Cost Analysis Results

Based on your requirements, here's the **optimized recommendation**:

### Recommended Model: `gpt-3.5-turbo`

**Key Benefits:**
- Monthly cost: $2,400 (60% savings)
- P90 latency: 1,200ms
- Best cost-performance ratio

**Cost Breakdown:**
1. Input tokens: $1,200/month
2. Output tokens: $1,200/month
3. Total: $2,400/month

> **Note:** This recommendation is based on your current workload of 10,000 daily API calls.

For more details, visit our [pricing guide](https://example.com).
```

## Styling Details

### Custom Component Styles
- **Paragraphs**: `mb-2 last:mb-0` (spacing between paragraphs)
- **Strong text**: `font-semibold text-soft-navy` (brand color)
- **Lists**: `list-disc list-inside mb-2 space-y-1` (proper spacing)
- **Code**: `bg-fog-gray px-1 py-0.5 rounded text-xs font-mono`
- **Links**: `text-muted-indigo hover:text-muted-indigo/80 underline`

### Design Principles
- Uses your existing design system colors
- Maintains readability within chat bubbles
- Responsive design for mobile/desktop
- Proper spacing and typography hierarchy 