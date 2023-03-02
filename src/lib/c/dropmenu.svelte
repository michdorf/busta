<div class="dropdown">
    <button class="dropbtn">...</button>
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
}

.dropdown-content {
display: none;
position: absolute;
background-color: #f1f1f1;
box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
/* z-index: 1; */
}

.dropdown:hover .dropdown-content {display: block;}
</style>