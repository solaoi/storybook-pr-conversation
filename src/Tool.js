import React, { useCallback } from "react";
import { STORY_RENDERED } from '@storybook/core-events';
import { useGlobals, useChannel } from "@storybook/api";
import { Icons, IconButton } from "@storybook/components";
import { TOOL_ID } from "./constants";

export const Tool = () => {
  const [{ showMark }, updateGlobals] = useGlobals();

  useChannel({
    [STORY_RENDERED]: () => {
    // when you load the first time, check searchParams.
    const searchParams = new URL(parent.location.href).searchParams;
    if (searchParams.get("x") && searchParams.get("y")) {
      updateGlobals({
        showMark: true,
      });
    }
  }});

  const toggleShowMark = useCallback(() => {
    // prev state is true
    if (showMark) {
      const parentUrl = new URL(parent.location.href);
      parentUrl.searchParams.delete("x");
      parentUrl.searchParams.delete("y");
      parent.history.pushState({}, "", parentUrl);
    }
    updateGlobals({
      showMark: !showMark,
    });
  }, [showMark]);

  return (
    <IconButton
      key={TOOL_ID}
      active={showMark}
      title="Enable PR Conversation"
      onClick={toggleShowMark}
    >
      <Icons icon="pullrequest" />
    </IconButton>
  );
};
