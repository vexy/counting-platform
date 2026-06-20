<script lang="ts">
    import Loader from '$components/Loader.svelte';
    import type { QuestionOverview } from '$models/Question.js';

    let { data } = $props();

    let searchTerm: string = $state('');
    let showResetArea: boolean = $state(false);
    let hasSearchResults: boolean = $state(false);
    let tableData: QuestionOverview[] = $state([]);

    async function performSearch() {
        // check if we just need to reset
        if(searchTerm.length === 0) {
            resetSearch();
        } else {
            // get actual data set to perform filtering on
            const returnedData = await data.allQuestions;
            //perform filtering on table data
            tableData = returnedData.filter((question) => {
                return question.title.toLowerCase().includes(searchTerm.toLowerCase())
            })

            // show reset area
            hasSearchResults = true;
            showResetArea = true;
        }
    }

    function resetSearch() {
        searchTerm = '';
        showResetArea = false;
        hasSearchResults = false;
    }
</script>

<search-area>
    <div>
        <input
            name="search-bar"
            type="text"
            placeholder="Претражите наслов питања"
            bind:value={searchTerm}
        />
        <button class="search-button" onclick={performSearch}>
            <img 
                src="/search.svg" 
                alt="search_icon"
                height="20px" width="20px"
            />
            Пронађи
        </button>
    </div>

    {#if showResetArea}
        <reset-area>
            <span>Пронађено: {tableData.length} питања</span>
            <button onclick={resetSearch}>
                <i>Прикажи сва питања</i>
                <img 
                    src="/clear.svg" 
                    alt="clear_search"
                    height="22px" width="22px"
                />
            </button>
        </reset-area>
    {/if}
</search-area>

{#await data.allQuestions}
    <Loader message="Учитавање питања..." />
{:then questionSet}
    <questions-table>
        {#each (hasSearchResults ? tableData : questionSet) as questionItem }
            <a class='article' type="button" href="/question/{questionItem.id}">
                <!-- <img src="/people.svg" alt="vote_count" height="21px" width="21px" /> -->
                <div class='question-title'>{questionItem.title}</div>
                <metadata>
                    {new Date(questionItem.created_at).toLocaleDateString()}

                    <div>
                        <img src="/people.svg" alt="vote_count" height="21px" width="21px" />
                        { questionItem.voters_count.length }
                    </div>
                </metadata>
            </a>
        {/each}
    </questions-table>
{/await}

<style>
    search-area {
        align-self: center;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    search-area > div {
        display: flex;
        align-items: center;
    }
    
    input {
        letter-spacing: 1.25px;
        margin-block: 0.85rem;
        margin-inline-start: 0.5rem;
        min-width: 210px;
        border: 1.75px solid var(--footer);
    }

    .search-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }

    reset-area {
        align-self: center;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    reset-area > button {
        display: flex;
        align-items: center;
        background: none;
        gap: 0.35rem;
    }

    span {
        font-size: smaller;
        font-style: italic;
        font-weight: 200;
    }

    i {
        color: var(--orange);
    }


    button {
        margin-inline: 0.75rem;
    }

    questions-table {
        margin-top: 0.3rem;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
    }

    .article {
        margin-inline: 0.25rem;
        padding: 10px;

        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        gap: 3.5px;

        border-radius: 15px;
        border: 0.8px gray solid;

        text-decoration: none;
    }

    .article:hover {
        box-shadow: 1px 2.5px 8px 3px #9eb5b5;
    }
    .article:hover > .question-title {
        font-size: 113%;
    }

    .article
        :visited, :active {
        color: inherit;
    }
    
    .question-title {
        flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 110%;

        color: var(--blue-dark);
    }

    metadata {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--footer);
    }

    metadata > div {
        display: flex;
        align-items: center;
        gap: 5px;
    }
</style>