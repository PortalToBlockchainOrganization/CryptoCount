import React from "react";


function ClipboardCopy({ copyText }) {
    const [isCopied, setIsCopied] = useState(false);
  
    // TODO: Implement copy to clipboard functionality

    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
          return await navigator.clipboard.writeText(text);
        } else {
          return document.execCommand('copy', true, text);
        }
      }
  
        // onClick handler function for the copy button
        const handleCopyClick = () => {
            // Asynchronously call copyTextToClipboard
            copyTextToClipboard(copyText)
            .then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
        }

    return (
      <div>
        <input type="text" value={copyText} readOnly />
        <button>
          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    );
  }

  export default ClipboardCopy;
