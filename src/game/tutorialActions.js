export function findMatchingBlob(balls, currentTier) {
  return balls.find((b) => !b.toRemove && !b.isMerging && b.tierIndex === currentTier) || null;
}

export function performQuickTap(ctrl, label, x, y) {
  ctrl.setBadge(label);
  ctrl.updateHandPos(x, y);
  ctrl.engine.handleAim(x, y);

  ctrl.schedule(() => {
    if (!ctrl.isRunning) return;
    ctrl.hand?.classList.add('tapping');
    ctrl.engine.handleLaunch();
    ctrl.dropCount++;

    ctrl.schedule(() => {
      ctrl.hand?.classList.remove('tapping');
      ctrl.scheduleNextAction(850);
    }, 200);
  }, 450);
}

export function performDragAim(ctrl, label, startX, startY, endX, endY) {
  ctrl.setBadge(label);
  ctrl.updateHandPos(startX, startY);
  ctrl.engine.handleAim(startX, startY);

  ctrl.schedule(() => {
    if (!ctrl.isRunning) return;
    ctrl.hand?.classList.add('tapping');

    const startTime = performance.now();
    const duration = 500;

    const stepDrag = (now) => {
      if (!ctrl.isRunning) return;
      const progress = Math.min(1, (now - startTime) / duration);
      const curX = startX + (endX - startX) * progress;
      const curY = startY + (endY - startY) * progress;

      ctrl.updateHandPos(curX, curY);
      ctrl.engine.handleAim(curX, curY);

      if (progress < 1) {
        ctrl.animFrame = requestAnimationFrame(stepDrag);
      } else {
        ctrl.schedule(() => {
          if (!ctrl.isRunning) return;
          ctrl.engine.handleLaunch();
          ctrl.dropCount++;
          ctrl.hand?.classList.remove('tapping');
          ctrl.scheduleNextAction(850);
        }, 180);
      }
    };

    ctrl.animFrame = requestAnimationFrame(stepDrag);
  }, 400);
}

export function performAimAndDrop(ctrl, label, x, y, isWall = false, isMerge = false) {
  ctrl.setBadge(label);
  ctrl.updateHandPos(x, y);
  ctrl.engine.handleAim(x, y);

  ctrl.schedule(() => {
    if (!ctrl.isRunning) return;
    ctrl.hand?.classList.add('tapping');
    ctrl.engine.handleLaunch();
    ctrl.dropCount++;

    ctrl.schedule(() => {
      ctrl.hand?.classList.remove('tapping');
      ctrl.scheduleNextAction(isMerge ? 1100 : 850);
    }, 200);
  }, isWall ? 600 : 450);
}
