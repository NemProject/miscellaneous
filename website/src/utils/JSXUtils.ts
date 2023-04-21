import React from 'react';

/**
 * Generate paragraph layout from text string
 * @param {string} str - text string
 * @param {string} className - class name to be assigned to each paragraph
 * @returns {JSX} JSX element which contains generated paragraph layout
 */
export function createParagraph(str: string, className?: string): JSX.Element {
    const paragraphs = str.split('\n');
    const reactParagraphs = paragraphs.map((paragraph, index) =>
        React.createElement('p', { className, key: 'p' + index }, paragraph),
    );

    return React.createElement(React.Fragment, {}, reactParagraphs);
}
