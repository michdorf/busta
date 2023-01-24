<script lang="ts">
    import Stato from '$lib/stato/main'; // Ensure load
    import {sync} from '$lib/api';

    sync({id:"asdasd"});
</script>

<nav>
    <a href="/conti">Agg. conto</a>
    <a href="/buste">Buste/bilanci</a>
</nav>

<slot></slot>