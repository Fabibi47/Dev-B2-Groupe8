const socket = new WebSocket('ws://localhost:8080'); // Adjust the URL as needed

socket.addEventListener('open', () => {
    // Notify server that this client is ready
    socket.send(JSON.stringify({ type: 'join' }));
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'start-game') {
        // Redirect both players to the game page with a unique game ID
        window.location.href = `/game.html?gameId=${encodeURIComponent(data.gameId)}`;
    }
});