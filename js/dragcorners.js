// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Makes the corner markers (#c-0 .. #c-3) of the correction pages draggable without jQuery.
 *
 * The markers are absolutely positioned images; their style.left/style.top (in px) are read
 * back by correct.php and participants_correct.php when the form is submitted.
 *
 * @package   mod_offlinequiz
 * @copyright 2026 Academic Moodle Cooperation {@link http://www.academic-moodle-cooperation.org}
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
(function() {
    'use strict';

    /**
     * Makes an absolutely positioned element draggable with the pointer (mouse, touch or pen).
     *
     * @param {HTMLElement} element The element to move.
     */
    function makeDraggable(element) {
        var startX = 0;
        var startY = 0;
        var startLeft = 0;
        var startTop = 0;

        element.style.touchAction = 'none';
        element.addEventListener('dragstart', function(event) {
            event.preventDefault();
        });

        element.addEventListener('pointerdown', function(event) {
            if (event.button !== undefined && event.button !== 0) {
                return;
            }
            startX = event.clientX;
            startY = event.clientY;
            startLeft = parseFloat(element.style.left) || element.offsetLeft;
            startTop = parseFloat(element.style.top) || element.offsetTop;
            element.setPointerCapture(event.pointerId);
            event.preventDefault();
        });

        element.addEventListener('pointermove', function(event) {
            if (!element.hasPointerCapture(event.pointerId)) {
                return;
            }
            element.style.left = (startLeft + event.clientX - startX) + 'px';
            element.style.top = (startTop + event.clientY - startY) + 'px';
        });

        var release = function(event) {
            if (element.hasPointerCapture(event.pointerId)) {
                element.releasePointerCapture(event.pointerId);
            }
        };
        element.addEventListener('pointerup', release);
        element.addEventListener('pointercancel', release);
    }

    var init = function() {
        for (var i = 0; i < 4; i++) {
            var corner = document.getElementById('c-' + i);
            if (corner) {
                makeDraggable(corner);
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
