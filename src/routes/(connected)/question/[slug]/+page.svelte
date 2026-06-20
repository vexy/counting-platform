<svelte:head>
    <meta name="description" content="Infoportal.app | Ваша питања, одговори, ставови и још много тога." />
    <meta name="keywords" content="people, question, opinion, vote, poll, survey, results, infoportal">
</svelte:head>

<script lang="ts">
    import QuestionVote from '$components/QuestionVote.svelte';
    import ScoreDisplay from '$components/ScoreDisplay.svelte';
    import type { QuestionScores, QuestionMeta } from '$models/Question';
    import Loader from '$components/Loader.svelte';

    let { data } = $props();
</script>

 <!-- check what layout to use -->
{#if data.isAnswered}
    {#await data.scores}
        <Loader message='Loading scores...' />
    {:then scores}
        <ScoreDisplay scores={scores as QuestionScores} />
    {/await}
{:else}
    {#await data.meta}
        <Loader message='Loading question...' />
    {:then meta}
        <QuestionVote form={null} meta={meta as QuestionMeta} />
    {/await}
{/if}