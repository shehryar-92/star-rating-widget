import { StarRating } from "./components/StarRating.jsx";
import { ThemeToggle } from "./components/ThemeToggle.jsx";
import { useTheme } from "./hooks/useTheme.js";
import "./App.css";

const ITEMS = [
  { id: "dune-part-two", title: "Dune: Part Two" },
  { id: "the-bear-s3", title: "The Bear — Season 3" },
  { id: "hades-2", title: "Hades II" },
];

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Rate these</h1>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <ul className="item-list">
        {ITEMS.map((item) => (
          <li key={item.id} className="item-row">
            <StarRating id={item.id} label={item.title} />
          </li>
        ))}
      </ul>
    </div>
  );
}
