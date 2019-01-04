export default function permission(...allowed) {
    const isAllowed = role => ~allowed.indexOf(role);

    return (req, res, next) => {
        const role = req.decoded['isAdmin'] && 'admin';

        if (req.decoded && isAllowed(role)) {
            return next();
        } else {
            const error = new Error(`Forbidden role`);
            error.status = 403;
            return next(error);
        }
    }
}