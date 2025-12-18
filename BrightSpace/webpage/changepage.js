const injectScript = () => {
    if (window.__brightspaceRowHandlerAdded) return;
    window.__brightspaceRowHandlerAdded = true;

    const intervalId = setInterval(() => {
        try {
            const viewer = document.querySelector("d2l-sequence-viewer");
            if (!viewer || !viewer.shadowRoot) throw new Error("viewer not found");
            const router = viewer.shadowRoot.querySelector("d2l-sequences-content-router");
            if (!router || !router.shadowRoot) throw new Error("router not found");
            const link = router.shadowRoot.querySelector("d2l-sequences-content-link");
            if (!link || !link.shadowRoot) throw new Error("link not found");
            const iframe1 = link.shadowRoot.querySelector("#content");
            if (!iframe1) throw new Error("iframe1 not found");

            // Check if iframe1 is loaded
            if (!iframe1.contentWindow || !iframe1.contentWindow.document) {
                console.info("Brightspace Question Marker: iframe1 not ready yet.");
                return; // Continue polling
            }

            const doc1 = iframe1.contentWindow.document;
            const iframe2 = doc1.querySelector("#ctl_2");
            if (!iframe2) throw new Error("iframe2 not found");

            // Check if iframe2 is loaded
            if (!iframe2.contentWindow || !iframe2.contentWindow.document) {
                console.info("Brightspace Question Marker: iframe2 not ready yet.");
                return; // Continue polling
            }

            const doc2 = iframe2.contentWindow.document;
            const iframe3 = doc2.querySelector("#FRM_page");
            if (!iframe3) throw new Error("iframe3 not found");

            // Check if iframe3 is loaded
            if (!iframe3.contentWindow || !iframe3.contentWindow.document) {
                console.info("Brightspace Question Marker: iframe3 not ready yet.");
                return; // Continue polling
            }

            const doc3 = iframe3.contentWindow.document;
            const trs = doc3.querySelectorAll(".d2l-rowshadeonhover, .d2l-rowshadeonhover-selected");

            if (trs.length === 0) {
                console.info("Brightspace Question Marker: No .d2l-rowshadeonhover elements found yet.");
                return; // Continue polling if elements aren't there yet
            }

            clearInterval(intervalId);

            trs.forEach(tr => {
                const b = tr.querySelector("d2l-html-block");
                if (!b || !b.shadowRoot) {
                    console.warn("Brightspace Question Marker: d2l-html-block or its shadowRoot not found for a tr.");
                    return; // Skip this tr if block or shadowRoot is missing
                }
                const p = b.shadowRoot.querySelector("p");
                if (!p) {
                    console.warn("Brightspace Question Marker: p tag not found within d2l-html-block shadowRoot.");
                    return; // Skip this tr if p is missing
                }

                let pDefaultColor = window.getComputedStyle(p).color;
                tr.addEventListener("mouseup", (e) => {
                    switch (e.button) {
                        case 0: // left mouse button
                            break;
                        case 1: // middle mouse button
                            break;
                        case 2: // right mouse button
                            if (p.style.color === "" || p.style.color === pDefaultColor) {
                                p.style.color = "#BBB";
                                p.style.textDecoration = "line-through";
                            } else {
                                p.style.color = pDefaultColor;
                                p.style.textDecoration = "";
                            }
                            break;
                        default:
                            console.log(`Unknown button code: ${e.button}`);
                    }
                });
                tr.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                });
            });

            console.log("%cBrightspace Question Marker has loaded successfuly!", "background: green; padding: 2px 6px; border-radius: 3px;");

        } catch (e) {
            console.info("Brightspace Question Marker is trying to identify the test. Error:", e.message);
        }
    }, 1000);
};

// Listen for the main window's load event
window.addEventListener("load", injectScript);
// Or if the content is loaded dynamically after window load, consider MutationObserver on relevant parts of the DOM.

