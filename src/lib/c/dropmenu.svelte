<script lang="ts">
    let show = false;
    let btn: HTMLButtonElement;

    document.body.addEventListener("click", function (event) {
        if (event.target !== btn) {
            show = false;
        }
    });
</script>

<div class="dropdown" class:open={show}>
    <button class="dropbtn" bind:this={btn} on:click={() => {show = !show}}>...</button>
    <div class="dropdown-content">
        <slot />
    </div>
</div>

<style>
.dropbtn {
font-size: 16px;
}

.dropdown {
position: relative;
display: inline-block;
z-index: initial;
}
.dropdown.open {
    z-index: 1;
}

.dropdown-content {
display: none;
position: absolute;
background-color: #f1f1f1;
box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}

.dropdown.open .dropdown-content {
    display: block;
}
</style>