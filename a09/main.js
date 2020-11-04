const main = async () => {
    try {
        const result = await axios({
            method: 'get',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
            withCredentials: true,
            params: {
               limit: 30
            }
        });
        ReactDOM.render(
            <App tweets={result.data} />,
            document.getElementById('app')
        );
    } catch (error) {
        console.log(error);
    }
}

main();