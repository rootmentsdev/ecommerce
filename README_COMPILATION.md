# LaTeX Documentation Compilation Guide

This document explains how to compile the LaTeX documentation for the dappr SQUAD E-Commerce Platform.

## Prerequisites

You need a LaTeX distribution installed on your system:

### Windows
- **MiKTeX**: Download from https://miktex.org/
- **TeX Live**: Download from https://www.tug.org/texlive/

### macOS
- **MacTeX**: Download from https://www.tug.org/mactex/
- Or use Homebrew: `brew install --cask mactex`

### Linux
```bash
# Ubuntu/Debian
sudo apt-get install texlive-full

# Fedora
sudo dnf install texlive-scheme-full
```

## Required LaTeX Packages

The documentation uses the following packages (most are included in full LaTeX distributions):
- `geometry` - Page layout
- `graphicx` - Graphics support
- `hyperref` - Hyperlinks
- `listings` - Code listings
- `xcolor` - Colors
- `amsmath` - Math support
- `enumitem` - List formatting
- `titlesec` - Section formatting
- `fancyhdr` - Headers/footers
- `tocloft` - Table of contents
- `booktabs` - Professional tables
- `longtable` - Multi-page tables
- `array` - Array support

## Compilation

### Method 1: Command Line (Recommended)

```bash
# Navigate to the directory containing the .tex file
cd path/to/ECommerceSite

# Compile the document (may need to run multiple times for references)
pdflatex ECommerceSite_Documentation.tex
pdflatex ECommerceSite_Documentation.tex

# Or use the full compilation sequence (for bibliography/index)
pdflatex ECommerceSite_Documentation.tex
pdflatex ECommerceSite_Documentation.tex
```

### Method 2: Using an IDE

#### TeXstudio (Recommended)
1. Download TeXstudio from https://www.texstudio.org/
2. Open `ECommerceSite_Documentation.tex`
3. Click "Build & View" (F5) or "Build" (F6)

#### Overleaf (Online)
1. Go to https://www.overleaf.com/
2. Create a new project
3. Upload `ECommerceSite_Documentation.tex`
4. Click "Recompile"

#### VS Code
1. Install the "LaTeX Workshop" extension
2. Open the .tex file
3. Press Ctrl+Alt+B (Windows/Linux) or Cmd+Option+B (Mac) to build

## Output

After successful compilation, you'll get:
- `ECommerceSite_Documentation.pdf` - The final PDF document

## Troubleshooting

### Missing Packages
If you get errors about missing packages:
```bash
# MiKTeX (Windows) - usually auto-installs
# TeX Live - install via package manager
sudo apt-get install texlive-extra-utils
```

### Font Issues
If fonts are missing:
- MiKTeX: Check "Settings" → "Repositories" → "Update"
- TeX Live: Update package database

### Compilation Errors
- Run `pdflatex` twice to resolve cross-references
- Check for syntax errors in the .tex file
- Ensure all required packages are installed

## Alternative: Convert to PDF Online

If you prefer not to install LaTeX:
1. Upload the .tex file to Overleaf (https://www.overleaf.com/)
2. The online compiler will handle everything
3. Download the compiled PDF

## File Structure

```
ECommerceSite/
├── ECommerceSite_Documentation.tex    # Main LaTeX source file
├── README_COMPILATION.md              # This file
└── (other project files)
```

## Notes

- The document uses A4 paper size
- Code listings use JavaScript syntax highlighting
- Hyperlinks are color-coded (blue for internal, cyan for external)
- The document includes a table of contents, abstract, and appendix
- All sections are numbered and cross-referenced

## Quick Start

```bash
# Install LaTeX (if not already installed)
# Then compile:
pdflatex ECommerceSite_Documentation.tex
pdflatex ECommerceSite_Documentation.tex

# Open the PDF
# Windows: start ECommerceSite_Documentation.pdf
# macOS: open ECommerceSite_Documentation.pdf
# Linux: xdg-open ECommerceSite_Documentation.pdf
```

