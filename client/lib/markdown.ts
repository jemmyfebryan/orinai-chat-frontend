export function parseMarkdown(text: string): string {
  // Escape HTML
  let result = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Replace code blocks (simple version)
  result = result.replace(/```([^`]+)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm overflow-x-auto my-2"><code>$1</code></pre>');

  // Headers
  result = result
    .replace(/^###### (.+)$/gm, '<h6 class="text-sm font-semibold mt-4 mb-2">$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5 class="text-base font-semibold mt-4 mb-2">$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-semibold mt-4 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>');

  // Bullet list items
  result = result.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Group list items into <ul>
  result = result.replace(/(<li[^>]*>.*<\/li>\s*)+/g, match => {
    const items = match.replace(/\s*$/, ''); // remove trailing whitespace
    return `<ul class="space-y-1 my-2">${items}</ul>`;
  });

  // Bold and italic
  result = result
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

  // Replace remaining newlines with <br>, except inside block elements
  result = result.replace(/(?<!>)\n(?!<)/g, '<br>');

  return result;
}
