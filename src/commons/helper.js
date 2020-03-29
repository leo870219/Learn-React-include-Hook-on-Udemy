
    export const formatPrice = dollar => {
        return (dollar/10).toLocaleString('zh', {
            style:'currency',
            currency:'NTD'
        });
    }