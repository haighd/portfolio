local first_h1_rendered = false

function Header(el)
  if el.level == 1 and not first_h1_rendered then
    first_h1_rendered = true
    local title = pandoc.utils.stringify(el.content)
    return pandoc.RawBlock("latex", "{\\LARGE\\bfseries " .. title .. "\\par\\vspace{0.5em}}")
  end

  return el
end

function HorizontalRule()
  return pandoc.RawBlock("latex", "\\vspace{0.15em}\\begin{center}\\rule{0.5\\linewidth}{0.4pt}\\end{center}\\vspace{0.05em}")
end

function Pandoc(doc)
  local blocks = {}
  local current_section = nil
  local seen_experience_job = false

  for _, block in ipairs(doc.blocks) do
    if block.t == "Header" and block.level == 2 then
      current_section = pandoc.utils.stringify(block.content):lower()
      if current_section ~= "experience" then
        seen_experience_job = false
      end
      table.insert(blocks, block)
      table.insert(blocks, pandoc.RawBlock("latex", "\\vspace{0.5em}"))
    elseif current_section == "experience" and block.t == "Header" and block.level == 3 then
      if seen_experience_job then
        table.insert(blocks, pandoc.RawBlock("latex", "\\vspace{0.45em}"))
      end
      table.insert(blocks, pandoc.Para({ pandoc.Strong(block.content) }))
      seen_experience_job = true
    else
      table.insert(blocks, block)
    end
  end

  return pandoc.Pandoc(blocks, doc.meta)
end