import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
function SearchBar({ placeholder = "Search...", className = "" }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/articles?search=${encodeURIComponent(query.trim())}`);
    }
  };
  return /* @__PURE__ */ React.createElement("form", { onSubmit: handleSearch, className: `relative w-full group ${className}` }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" }, /* @__PURE__ */ React.createElement(Search, { className: "h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" })), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: query,
      onChange: (e) => setQuery(e.target.value),
      placeholder,
      className: "block w-full pl-12 pr-4 py-3.5 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl glass text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-sm focus:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
    }
  ));
}
export {
  SearchBar as default
};
