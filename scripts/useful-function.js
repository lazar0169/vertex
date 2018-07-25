function get(name) {
    let mark = name.charAt(0);

    switch (mark) {
        case '#':
            return document.getElementById(name.substring(1, 50));

        case '.':
            return document.getElementsByClassName(name.substring(1, 50));

        default:
            return document.getElementsByTagName(name);
    }
}