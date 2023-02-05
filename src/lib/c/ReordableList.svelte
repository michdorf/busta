<script>
  export let list;
  var _el;
  var oldStyle;

  function isBefore(el1, el2) {
    if (el2.parentNode === el1.parentNode)
      for (
        var cur = el1.previousSibling;
        cur && cur.nodeType !== 9;
        cur = cur.previousSibling
      )
        if (cur === el2) return true;
    return false;
  }

  function dragStart(e) {
    console.log("dragStart()");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", null);
    _el = e.target;
    oldStyle = _el.style.backgroundColor;
    _el.style.backgroundColor = "#e5e5e5";
  }

  function dragOver(e) {
    console.log("dragOver()");
    if (isBefore(_el, e.target))
      e.target.parentNode.insertBefore(_el, e.target);
    else e.target.parentNode.insertBefore(_el, e.target.nextSibling);
  }

  function dragEnd(e) {
    console.log("dragEnd()");
    _el.style = oldStyle;
  }

  function touchStart(e) {
    console.log("touchStart()");
    e.preventDefault();

    if (e.touches.length == 1) {
      _el = e.targetTouches[0].target;
      oldStyle = _el.style.backgroundColor;
      _el.style.backgroundColor = "#e5e5e5";
    }
  }

  function touchMove(e) {
    console.log("touchMove()");
    e.preventDefault();

    if (isBefore(_el, e.target))
      e.target.parentNode.insertBefore(_el, e.target);
    else e.target.parentNode.insertBefore(_el, e.target.nextSibling);
  }

  function touchEnd(e) {
    console.log("touchEnd()");
    _el.style = oldStyle;
  }
</script>

<style>
  .item {
    user-select: none;
    width: 200px;
    border-style: solid;
    border-width: 1px;
    border-color: gray;
    padding: 10px;
    text-align: center;
  }
</style>

<svelte:head>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, user-scalable=no" />
</svelte:head>

<div style="list-style-type:none;font-size: 18pt; font-weight:bold;">

  {#each list as item}

      <div
        class="item"
        draggable="true"
        on:dragstart={dragStart}
        on:dragover={dragOver}
        on:dragend={dragEnd}
        on:touchstart={touchStart}
        on:touchmove={touchMove}
        on:touchend={touchEnd}>
        {item}
      </div>

  {/each}
</div>
