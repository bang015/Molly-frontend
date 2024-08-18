export const formatTextToHTML = (content: string) => {
  return content
    .replace(/\n/g, '<br>')
    .replace(/#([^\s]+)/g, '<span style="color: rgb(0, 55, 107);">#$1</span>')
}

export const formatHTMLToText = (content: string) => {
  return content
    .replace(/<br>/g, '\n')
    .replace(/<span style="color: rgb\(0, 55, 107\);">#([^<]+)<\/span>/g, '#$1')
}
