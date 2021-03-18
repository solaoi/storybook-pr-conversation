/* eslint-env browser */
import { useEffect, useGlobals } from "@storybook/addons";
const copy = require("clipboard-copy");

// local funcs
function hasPositionParams(searchParams) {
  return searchParams.get("x") && searchParams.get("y");
}

function createCommentMark(size, x, y) {
  const comment = document.createElement("div");
  comment.className = "comment";
  const val = document.createTextNode("!");
  comment.appendChild(val);
  comment.style.setProperty("display", "flex");
  comment.style.setProperty("justify-content", "center");
  comment.style.setProperty("align-items", "center");
  comment.style.setProperty("color", "#FFF");
  comment.style.setProperty("font-weight", "700");

  comment.style.setProperty("width", size + "px");
  comment.style.setProperty("height", size + "px");
  comment.style.setProperty("border-radius", "50%");
  comment.style.setProperty("background-color", "orange");
  comment.style.setProperty("box-shadow", "5px 5px 10px gray");
  comment.style.setProperty("border", "2px solid #FFF");

  comment.style.setProperty("position", "absolute");
  comment.style.setProperty("top", y - size / 2 + "px");
  comment.style.setProperty("left", x - size / 2 + "px");

  return comment;
}

function removeCommentMark() {
  const commnet = document.getElementsByClassName("comment");
  if (commnet) {
    Array.from(commnet).forEach((e) => e.remove());
  }
}

function displayToolState(showMark) {
  const rootElement = document.getElementById("root");
  const searchParams = new URL(parent.location.href).searchParams;

  if (!showMark) {
    removeCommentMark();
    rootElement.onclick = undefined;
    rootElement.style.removeProperty("cursor");
    return;
  }
  rootElement.style.setProperty("cursor", "pointer");

  if (hasPositionParams(searchParams)) {
    const comment = createCommentMark(
      26,
      searchParams.get("x"),
      searchParams.get("y")
    );
    rootElement.appendChild(comment);
  }

  rootElement.onclick = function (e) {
    e.preventDefault();
    // remove previous comment mark
    removeCommentMark();
    // copy this position to paste on PR Conversation
    const parentUrl = new URL(parent.location.href);
    parentUrl.searchParams.set("x", e.clientX);
    parentUrl.searchParams.set("y", e.clientY);
    copy(parentUrl);
    parent.history.pushState({}, "", parentUrl);
    // create comment mark
    const comment = createCommentMark(26, e.clientX, e.clientY);
    // set comment mark
    rootElement.appendChild(comment);
  };
}

// global func
export const withGlobals = (StoryFn, context) => {
  const [{ showMark }, updateGlobals] = useGlobals();
  useEffect(() => {
    const searchParams = new URL(parent.location.href).searchParams;
    if (searchParams.get("x") && searchParams.get("y")) {
      updateGlobals({
        showMark: true,
      });
    }
  }, []);
  useEffect(() => {
    displayToolState(showMark);
  }, [showMark]);

  return StoryFn();
};
