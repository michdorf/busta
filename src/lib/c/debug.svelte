<script lang="ts">
    const dev = process.env.NODE_ENV === 'development';

    const DEBUG = dev;
</script>

{#if DEBUG}
    <span><slot></slot></span>
{/if}

<style>
    span {
        text-decoration: underline;
        border-color: #e98b0d;
        background: repeating-linear-gradient(
            135deg,
            #feae42,
            #feae42 8px,
            #e98b0d 8px,
            #e98b0d 16px
            );
    }
</style>