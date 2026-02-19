# Semantic Workspace - AI Document Intelligence System

A professional React-based dashboard for AI-powered document intelligence with semantic search, file management, and RAG-powered chat capabilities.

## 🎨 Features

### ✨ Modern Dark UI
- **Glassmorphism Design** - Translucent cards with backdrop blur effects
- **Neon Blue Accents** - Professional enterprise aesthetic
- **Dark Gradient Background** - `#0b1120` → `#020617`
- **Smooth Animations** - Hover effects, transitions, and micro-interactions
- **Fully Responsive** - Adapts to desktop, tablet, and mobile screens

### 📁 File Management
- **Drag & Drop Upload** - Upload `.txt` and `.pdf` files
- **Progress Tracking** - Real-time upload progress indicators
- **File List View** - Scrollable list with metadata (word count, cluster ID)
- **Auto-refresh** - Automatically updates after successful uploads

### 🔍 Semantic Search
- **Vector Search** - Find relevant documents using semantic similarity
- **Result Cards** - Display similarity scores and content snippets
- **Real-time Results** - Instant search feedback

### 🤖 AI Chat Assistant
- **RAG-Powered** - Retrieval-Augmented Generation for accurate answers
- **Source Attribution** - Shows which files were used to generate answers
- **Confidence Scores** - Displays AI confidence in responses
- **Auto-scroll** - Automatically scrolls to latest messages
- **Typing Indicators** - Shows when AI is processing

### 📊 System Status Panel
- **Live Monitoring** - Real-time system health indicators
- **Cluster Stats** - Number of semantic clusters
- **File Count** - Total indexed files
- **Status Badges** - Online/offline indicators with pulse animations

## 🏗️ Component Structure

```
frontend/src/components/
├── SemanticWorkspace.jsx      # Main container (3-column layout)
├── SemanticWorkspace.css      # Layout and responsive styles
├── FileUpload.jsx             # Drag-drop upload component
├── FileUpload.css             # Upload zone styling
├── FileList.jsx               # Indexed files display
├── FileList.css               # File list styling
├── SearchPanel.jsx            # Semantic search interface
├── SearchPanel.css            # Search panel styling
├── ChatAssistant.jsx          # AI chat interface
├── ChatAssistant.css          # Chat styling
├── StatusPanel.jsx            # System metrics display
└── StatusPanel.css            # Status panel styling
```

## 🔌 API Integration

All components connect to the backend at `http://127.0.0.1:8000`:

### Endpoints Used

| Endpoint | Method | Purpose | Request Body |
|----------|--------|---------|--------------|
| `/upload` | POST | Upload files | FormData with file |
| `/files` | GET | List indexed files | - |
| `/search` | POST | Semantic search | `{ query: string }` |
| `/ask` | POST | RAG chat query | `{ query: string }` |
| `/status` | GET | System health | - |

## 🚀 Usage

### Import the Component

```jsx
import SemanticWorkspace from './components/SemanticWorkspace';

function App() {
  return <SemanticWorkspace />;
}
```

### Layout Structure

The workspace uses a 3-column flexbox layout:

```
┌─────────────────────────────────────────────────────┐
│  LEFT PANEL  │    CENTER PANEL     │  RIGHT PANEL   │
│              │                     │                │
│   System     │   File Upload       │   AI Chat      │
│   Status     │   File List         │   Assistant    │
│              │   Search Panel      │                │
└─────────────────────────────────────────────────────┘
```

## 🎨 Design Principles

### Color Palette
- **Background**: Dark gradient (`#0b1120` → `#020617`)
- **Primary Accent**: Neon blue (`#60a5fa`, `#3b82f6`)
- **Success**: Green (`#22c55e`)
- **Error**: Red (`#ef4444`)
- **Text**: Light gray (`#e2e8f0`, `#cbd5e1`, `#94a3b8`)

### Typography
- **Font Family**: Inter, system fonts
- **Headings**: 600-700 weight
- **Body**: 400-500 weight
- **Code/Monospace**: Monaco, Courier New

### Glassmorphism Effects
```css
background: rgba(15, 23, 42, 0.6);
backdrop-filter: blur(20px);
border: 1px solid rgba(148, 163, 184, 0.1);
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1400px (3 columns)
- **Tablet**: 1200px - 1400px (narrower panels)
- **Mobile**: < 1200px (stacked layout)

## ⚡ Performance Features

- **Auto-polling**: Status updates every 5 seconds
- **Debounced Search**: Prevents excessive API calls
- **Optimized Scrolling**: Custom scrollbars with smooth behavior
- **Lazy Loading**: Components render on demand

## 🛠️ Customization

### Modify Colors
Edit the CSS files to change the color scheme:
- Primary blue: Search for `#60a5fa` and `#3b82f6`
- Background: Update gradient in `SemanticWorkspace.css`

### Adjust Layout
- Panel widths: `.left-panel` (280px), `.right-panel` (380px)
- Spacing: Modify `gap` values in `.semantic-workspace`

### Change Animations
- Hover effects: Adjust `transition` and `transform` properties
- Timing: Modify `ease`, `linear`, or custom cubic-bezier values

## 🐛 Error Handling

All components include:
- **Network Error Handling**: Graceful fallbacks when backend is offline
- **Empty States**: User-friendly messages when no data exists
- **Loading States**: Spinners and progress indicators
- **Toast Notifications**: Success/error messages for user actions

## 📦 Dependencies

- **React**: ^18.x
- **Fetch API**: Native browser API (no axios needed)

## 🎯 Best Practices

1. **Always handle loading states** - Show spinners during async operations
2. **Provide user feedback** - Toast notifications for actions
3. **Graceful degradation** - Handle backend offline scenarios
4. **Accessibility** - Use semantic HTML and ARIA labels
5. **Performance** - Minimize re-renders with proper state management

## 🔮 Future Enhancements

- [ ] File preview modal
- [ ] Batch file operations
- [ ] Advanced search filters
- [ ] Export search results
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts
- [ ] File drag-to-reorder
- [ ] Chat history persistence

---

**Built with ❤️ for AI-powered document intelligence**
