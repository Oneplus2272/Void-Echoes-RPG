#loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--dark);
}

.logo-main {
    width: 200px;
    height: 200px;
    margin-bottom: 30px;
    object-fit: contain;
}

.loader-container {
    width: 80%;
    max-width: 300px;
    text-align: center;
}

#loading-pct {
    margin-bottom: 10px;
    font-size: 18px;
    color: var(--gold);
}

.progress-bar {
    width: 100%;
    height: 10px;
    background: #333;
    border-radius: 5px;
    overflow: hidden;
}

.progress-fill {
    width: 0%;
    height: 100%;
    background: var(--gold);
    transition: width 0.3s;
}
