// Global variables
        let batterySetupStep = 1;
        let batteryComplete = false;
        let chargingAnimation = null;
        let dischargingAnimation = null;
        let chargingGraph = null;
        let dischargingGraph = null;
        let chargingData = [];
        let dischargingData = [];
        let chargingTime = 0;
        let dischargingTime = 0;
        let chargingRunning = false;
        let dischargingRunning = false;
        let chargingVoltage = 0;
        let dischargingVoltage = 4.2;
        let chargingCharge = 0;
        let dischargingCharge = 100;

        // Initialize canvases
        function initGraphs() {
            const chargingCanvas = document.getElementById('charging-graph');
            const dischargingCanvas = document.getElementById('discharging-graph');
            
            chargingGraph = chargingCanvas.getContext('2d');
            dischargingGraph = dischargingCanvas.getContext('2d');
            
            chargingCanvas.width = chargingCanvas.offsetWidth;
            chargingCanvas.height = chargingCanvas.offsetHeight;
            dischargingCanvas.width = dischargingCanvas.offsetWidth;
            dischargingCanvas.height = dischargingCanvas.offsetHeight;
            
            drawGraphAxes(chargingGraph, chargingCanvas, 'Charging');
            drawGraphAxes(dischargingGraph, dischargingCanvas, 'Discharging');
        }

        function drawGraphAxes(ctx, canvas, type) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            
            // Draw axes
            ctx.beginPath();
            ctx.moveTo(50, 20);
            ctx.lineTo(50, canvas.height - 40);
            ctx.lineTo(canvas.width - 20, canvas.height - 40);
            ctx.stroke();
            
            // Labels
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText('Time (s)', canvas.width - 60, canvas.height - 10);
            ctx.save();
            ctx.translate(15, canvas.height / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText('Voltage (V)', -30, 0);
            ctx.restore();
            
            // Y-axis scale
            const maxV = type === 'Charging' ? 5 : 4.5;
            for (let i = 0; i <= maxV; i += 0.5) {
                const y = canvas.height - 40 - (i / maxV) * (canvas.height - 60);
                ctx.fillText(i.toFixed(1), 20, y + 3);
            }
        }

        // Drag and drop functionality
        function initDragAndDrop() {
            const components = document.querySelectorAll('.component-box');
            const beaker = document.getElementById('beaker');
            
            components.forEach(component => {
                component.addEventListener('dragstart', handleDragStart);
                component.addEventListener('dragend', handleDragEnd);
            });
            
            beaker.addEventListener('dragover', handleDragOver);
            beaker.addEventListener('drop', handleDrop);
        }

        function handleDragStart(e) {
            e.dataTransfer.setData('text/plain', e.target.dataset.component);
            e.target.classList.add('dragging');
        }

        function handleDragEnd(e) {
            e.target.classList.remove('dragging');
        }

        function handleDragOver(e) {
            e.preventDefault();
        }

        function handleDrop(e) {
            e.preventDefault();
            const componentType = e.dataTransfer.getData('text/plain');
            addComponent(componentType);
        }

        function addComponent(type) {
            const instruction = document.getElementById('instruction');
            const electrolyte = document.getElementById('electrolyte');
            const separator = document.getElementById('separator');
            const anode = document.getElementById('anode');
            const cathode = document.getElementById('cathode');
            const connector = document.getElementById('connector');
            const beaker = document.getElementById('beaker');
            
            switch (batterySetupStep) {
                case 1:
                    if (type === 'electrolyte') {
                        electrolyte.style.height = '300px';
                        electrolyte.style.opacity = '1';
                        instruction.textContent = 'Add separator to its location';
                        highlightArea('separator');
                        batterySetupStep = 2;
                    }
                    break;
                case 2:
                    if (type === 'separator') {
                        separator.style.opacity = '1';
                        instruction.textContent = 'Add Anode to its location';
                        highlightArea('anode');
                        batterySetupStep = 3;
                        removeHighlight();
                    }
                    break;
                case 3:
                    if (type === 'anode') {
                        anode.style.opacity = '1';
                        instruction.textContent = 'Add cathode to its location';
                        highlightArea('cathode');
                        batterySetupStep = 4;
                        removeHighlight();
                    }
                    break;
                case 4:
                    if (type === 'cathode') {
                        cathode.style.opacity = '1';
                        instruction.textContent = 'Add connector in its location';
                        highlightArea('connector');
                        batterySetupStep = 5;
                        removeHighlight();
                    }
                    break;
                case 5:
                    if (type === 'connector') {
                        connector.style.opacity = '1';
                        instruction.innerHTML = 'Congratulations! Your battery is ready to use.<br><button class="switch-btn" onclick="switchOn()">Switch On</button>';
                        batterySetupStep = 6;
                        removeHighlight();
                    }
                    break;
            }
        }

        function highlightArea(type) {
            const beaker = document.getElementById('beaker');
            switch (type) {
                case 'separator':
                    beaker.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.1) 45%, rgba(255,255,0,0.3) 48%, rgba(255,255,0,0.3) 52%, rgba(255,255,255,0.1) 55%)';
                    break;
                case 'anode':
                    beaker.style.background = 'linear-gradient(90deg, rgba(255,255,0,0.3) 0%, rgba(255,255,0,0.3) 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 100%)';
                    break;
                case 'cathode':
                    beaker.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.1) 60%, rgba(255,255,0,0.3) 65%, rgba(255,255,0,0.3) 100%)';
                    break;
                case 'connector':
                    beaker.style.boxShadow = '0 -10px 0 5px rgba(255,255,0,0.3), inset 0 0 20px rgba(255,255,255,0.2), 0 10px 30px rgba(0,0,0,0.3)';
                    break;
            }
        }

        function removeHighlight() {
            const beaker = document.getElementById('beaker');
            beaker.style.background = 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))';
            beaker.style.boxShadow = 'inset 0 0 20px rgba(255,255,255,0.2), 0 10px 30px rgba(0,0,0,0.3)';
        }

        function switchOn() {
            const bulb = document.getElementById('bulb');
            const labels = document.getElementById('labels');
            
            bulb.classList.add('glowing');
            labels.classList.add('visible');
            batteryComplete = true;
        }

        // Slider controls
        function initSliders() {
            const voltageSlider = document.getElementById('voltage-slider');
            const cRateSlider = document.getElementById('c-rate-slider');
            const resistanceSlider = document.getElementById('resistance-slider');
            const dischargeCRateSlider = document.getElementById('discharge-c-rate-slider');
            
            voltageSlider.addEventListener('input', updateVoltageDisplay);
            cRateSlider.addEventListener('input', updateCRateDisplay);
            resistanceSlider.addEventListener('input', updateResistanceDisplay);
            dischargeCRateSlider.addEventListener('input', updateDischargeCRateDisplay);
            
            voltageSlider.addEventListener('change', checkVoltageRange);
            cRateSlider.addEventListener('change', checkCRateRange);
            dischargeCRateSlider.addEventListener('change', checkDischargeCRateRange);
        }

        function updateVoltageDisplay() {
            const value = this.value;
            document.getElementById('voltage-value').textContent = value + 'V';
            updateSliderColor(this, 3.0, 5.0);
        }

        function updateCRateDisplay() {
            const value = this.value;
            document.getElementById('c-rate-value').textContent = value + 'C';
            updateSliderColor(this, 0.01, 2.0);
        }

        function updateResistanceDisplay() {
            const value = this.value;
            document.getElementById('resistance-value').textContent = value + 'Ω';
            updateSliderColor(this, 10, 100);
        }

        function updateDischargeCRateDisplay() {
            const value = this.value;
            document.getElementById('discharge-c-rate-value').textContent = value + 'C';
            updateSliderColor(this, 0.01, 2.0);
        }

        function updateSliderColor(slider, min, max) {
            const percent = ((slider.value - min) / (max - min)) * 100;
            slider.style.background = `linear-gradient(to right, #4facfe 0%, #00f2fe ${percent}%, #ddd ${percent}%, #ddd 100%)`;
        }

        function checkVoltageRange() {
            const value = parseFloat(this.value);
            if (value > 4.2) {
                showError('CAUTION! The battery will get damaged if charged at voltage above 4.2V');
            } else if (value < 3.5) {
                showError('CAUTION! The battery will not charge if charged at voltage below 3.5V');
            }
        }

        function checkCRateRange() {
            const value = parseFloat(this.value);
            if (value > 1.5) {
                showError('CAUTION! The battery will get damaged if charged at c-rate above 1.5C');
            } else if (value < 0.1) {
                showError('CAUTION! The battery will not charge if charged at C-rate below 0.1C');
            }
        }

        function checkDischargeCRateRange() {
            const value = parseFloat(this.value);
            if (value < 0.1) {
                showError('CAUTION! The battery will not discharge properly if C-rate is below 0.1C');
            }
        }

        function showError(message) {
            document.getElementById('error-message').textContent = message;
            document.getElementById('error-overlay').style.display = 'flex';
            pauseAllAnimations();
        }

        function hideError() {
            document.getElementById('error-overlay').style.display = 'none';
            resumeAllAnimations();
        }

        function pauseAllAnimations() {
            if (chargingAnimation) {
                cancelAnimationFrame(chargingAnimation);
                chargingAnimation = null;
            }
            if (dischargingAnimation) {
                cancelAnimationFrame(dischargingAnimation);
                dischargingAnimation = null;
            }
        }

        function resumeAllAnimations() {
            if (chargingRunning) {
                startChargingAnimation();
            }
            if (dischargingRunning) {
                startDischargingAnimation();
            }
        }

        // Charging cycle functions
        function startCharging() {
            chargingRunning = true;
            startChargingAnimation();
            updateChargingOutput();
        }

        function stopCharging() {
            chargingRunning = false;
            if (chargingAnimation) {
                cancelAnimationFrame(chargingAnimation);
                chargingAnimation = null;
            }
            updateChargingOutput();
        }

        function resetCharging() {
            chargingRunning = false;
            if (chargingAnimation) {
                cancelAnimationFrame(chargingAnimation);
                chargingAnimation = null;
            }
            chargingTime = 0;
            chargingVoltage = 0;
            chargingCharge = 0;
            chargingData = [];
            clearParticles('charging-beaker');
            drawGraphAxes(chargingGraph, document.getElementById('charging-graph'), 'Charging');
            updateChargingOutput();
        }

        function startChargingAnimation() {
            const beaker = document.getElementById('charging-beaker');
            const voltage = parseFloat(document.getElementById('voltage-slider').value);
            const cRate = parseFloat(document.getElementById('c-rate-slider').value);
            
            // Calculate speeds based on C-rate
            // Speed depends on both voltage and C-rate
            const voltageNorm = (voltage - 3.0) / (4.2 - 3.0);   // normalize voltage: 0 to 1
            const cRateNorm = (cRate - 0.1) / (1.5 - 0.1);       // normalize c-rate: 0 to 1
            const speedMultiplier = (voltageNorm + cRateNorm) / 2; // average effect

            const electronSpeed = 20 + 580 * speedMultiplier;  // From 20 to 600 px/sec
            const lithiumSpeed = 10 + 490 * speedMultiplier;   // From 10 to 500 px/sec
            // range: 30 to 300 px/sec
            
            console.log("Electron speed:", electronSpeed);
            console.log("Lithium speed:", lithiumSpeed);

            function animate() {
                if (!chargingRunning) return;

                const voltage = parseFloat(document.getElementById('voltage-slider').value);
                const cRate = parseFloat(document.getElementById('c-rate-slider').value);

                const voltageNorm = (voltage - 3.0) / (4.2 - 3.0);
                const cRateNorm = (cRate - 0.1) / (1.5 - 0.1);
                const speedMultiplier = (voltageNorm + cRateNorm) / 2;

                const electronSpeed = 20 + 180 * speedMultiplier;
                const lithiumSpeed = 20 + 180 * speedMultiplier;

                console.log("Electron speed:", electronSpeed);
                console.log("Lithium speed:", lithiumSpeed);
                
                // Create lithium ions (purple dots) from cathode to anode
                if (Math.random() < 0.1) {
                    createParticle(beaker, 'lithium-ion', 'charging', lithiumSpeed);
                }
                
                // Create electrons (red dots) in external circuit
                if (Math.random() < 0.1) {
                    createParticle(beaker, 'electron', 'charging', electronSpeed);
                }
                
                // Update graph
                chargingTime += 0.1;
                const rateFactor = (voltage * cRate) / 2.5;
                chargingVoltage = Math.min(4.2, voltage * (1 - Math.exp(-chargingTime * rateFactor / 10)));

                chargingCharge = Math.min(100, (chargingVoltage / 4.2) * 100);
                
                chargingData.push({time: chargingTime, voltage: chargingVoltage});
                drawChargingGraph();
                
                chargingAnimation = requestAnimationFrame(animate);
            }
            
            chargingAnimation = requestAnimationFrame(animate);
        }

        function drawChargingGraph() {
            const canvas = document.getElementById('charging-graph');
            drawGraphAxes(chargingGraph, canvas, 'Charging');
            
            if (chargingData.length < 2) return;
            
            chargingGraph.strokeStyle = '#4facfe';
            chargingGraph.lineWidth = 3;
            chargingGraph.beginPath();
            
            for (let i = 0; i < chargingData.length; i++) {
                const point = chargingData[i];
                const x = 50 + (point.time / 30) * (canvas.width - 70);
                const y = canvas.height - 40 - (point.voltage / 5) * (canvas.height - 60);
                
                if (i === 0) {
                    chargingGraph.moveTo(x, y);
                } else {
                    chargingGraph.lineTo(x, y);
                }
            }
            
            chargingGraph.stroke();
        }

        function updateChargingOutput() {
            document.getElementById('charging-ext-voltage').textContent = document.getElementById('voltage-slider').value + 'V';
            document.getElementById('charging-battery-voltage').textContent = chargingVoltage.toFixed(2) + 'V';
            document.getElementById('charging-battery-charge').textContent = chargingCharge.toFixed(1) + '%';
        }

        // Discharging cycle functions
        function startDischarging() {
            dischargingRunning = true;
            startDischargingAnimation();
            updateDischargingOutput();
        }

        function stopDischarging() {
            dischargingRunning = false;
            if (dischargingAnimation) {
                cancelAnimationFrame(dischargingAnimation);
                dischargingAnimation = null;
            }
            updateDischargingOutput();
        }

        function resetDischarging() {
            dischargingRunning = false;
            if (dischargingAnimation) {
                cancelAnimationFrame(dischargingAnimation);
                dischargingAnimation = null;
            }
            dischargingTime = 0;
            dischargingVoltage = 4.2;
            dischargingCharge = 100;
            dischargingData = [];
            clearParticles('discharging-beaker');
            document.getElementById('discharge-bulb').classList.remove('glowing');
            drawGraphAxes(dischargingGraph, document.getElementById('discharging-graph'), 'Discharging');
            updateDischargingOutput();
        }

        function startDischargingAnimation() {
            const beaker = document.getElementById('discharging-beaker');

            function animate() {
                if (!dischargingRunning) return;

                // Get slider values
                const resistance = parseFloat(document.getElementById('resistance-slider').value); // 10–100 ohms
                const cRate = parseFloat(document.getElementById('c-rate-slider').value); // 0.1–1.5

                // Normalize
                const resistanceNorm = (resistance - 10) / (100 - 10);  // 0 to 1
                const cRateNorm = (cRate - 0.1) / (1.5 - 0.1);           // 0 to 1

                // Speed logic: favor high c-rate, penalize high resistance
                const speedMultiplier = Math.max(0, (cRateNorm - resistanceNorm + 1) / 2); // range 0–1

                // Calculate speeds
                const electronSpeed = 50 + 350 * speedMultiplier;   // 50–400 px/sec
                const lithiumSpeed = 30 + 270 * speedMultiplier;    // 30–300 px/sec

                console.log("Discharge Electron Speed:", electronSpeed);
                console.log("Discharge Lithium Speed:", lithiumSpeed);

                // Create lithium ions
                if (Math.random() < 0.1) {
                    createParticle(beaker, 'lithium-ion', 'discharging', lithiumSpeed);
                }

                // Create electrons
                if (Math.random() < 0.1) {
                    createParticle(beaker, 'electron', 'discharging', electronSpeed);
                }

                // Update graph
                dischargingTime += 0.1;

                // Faster voltage drop with higher resistance and c-rate
                const decayFactor = (resistance * cRate) / 50;  // Tunable decay control
                dischargingVoltage = Math.max(0.1, 4.2 * Math.exp(-dischargingTime * decayFactor / 10));

                dischargingCharge = Math.max(0, (dischargingVoltage / 4.2) * 100);

                dischargingData.push({ time: dischargingTime, voltage: dischargingVoltage });
                drawDischargingGraph();

                dischargingAnimation = requestAnimationFrame(animate);
                if (dischargingCharge <= 0) {
                    dischargingRunning = false;
                    cancelAnimationFrame(dischargingAnimation);
                }

            }

            dischargingAnimation = requestAnimationFrame(animate);
        }


        function drawDischargingGraph() {
            const canvas = document.getElementById('discharging-graph');
            drawGraphAxes(dischargingGraph, canvas, 'Discharging');
            
            if (dischargingData.length < 2) return;
            
            dischargingGraph.strokeStyle = '#f44336';
            dischargingGraph.lineWidth = 3;
            dischargingGraph.beginPath();
            
            for (let i = 0; i < dischargingData.length; i++) {
                const point = dischargingData[i];
                const x = 50 + (point.time / 30) * (canvas.width - 70);
                const y = canvas.height - 40 - (point.voltage / 4.5) * (canvas.height - 60);
                
                if (i === 0) {
                    dischargingGraph.moveTo(x, y);
                } else {
                    dischargingGraph.lineTo(x, y);
                }
            }
            
            dischargingGraph.stroke();
        }

        function updateDischargingOutput() {
            document.getElementById('discharging-resistance').textContent = document.getElementById('resistance-slider').value + 'Ω';
            document.getElementById('discharging-battery-voltage').textContent = dischargingVoltage.toFixed(2) + 'V';
            document.getElementById('discharging-battery-charge').textContent = dischargingCharge.toFixed(1) + '%';
        }

        // Particle animation functions
        function createParticle(container, type, cycle, speed) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            
            let startX, startY, endX, endY;

            const beakerHeight = container.offsetHeight;
            const beakerWidth = container.offsetWidth;

            if (cycle === 'charging') {
                if (type === 'lithium-ion') {
                    // Random Y along cathode (right side), moving left to anode
                    startX = beakerWidth - 50;
                    startY = Math.random() * beakerHeight * 0.8 + beakerHeight * 0.1;
                    endX = 50;
                    endY = startY;
                } else {
                    // Electrons in external circuit (top path)
                    startX = beakerWidth - 50;
                    startY = -20;
                    endX = 50;
                    endY = -20;
                }
            } else { // discharging
                if (type === 'lithium-ion') {
                    // Random Y along anode (left side), moving right to cathode
                    startX = 50;
                    startY = Math.random() * beakerHeight * 0.8 + beakerHeight * 0.1;
                    endX = beakerWidth - 50;
                    endY = startY;
                } else {
                    // Electrons in external circuit (bottom path)
                    startX = 50;
                    startY = -20;
                    endX = beakerWidth - 50;
                    endY = -20;
                }
            }

            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            container.appendChild(particle);

            const dx = endX - startX;
            const dy = endY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const duration = (distance / speed) * 1000; // ✅ Now placed correctly

            particle.animate([
                { transform: `translate(0, 0)` },
                { transform: `translate(${dx}px, ${dy}px)` }
            ], {
                duration: duration,
                easing: 'linear'
            }).addEventListener('finish', () => {
                particle.remove();
            });
        }


        function clearParticles(containerId) {
            const container = document.getElementById(containerId);
            const particles = container.querySelectorAll('.particle');
            particles.forEach(particle => particle.remove());
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            initGraphs();
            initDragAndDrop();
            initSliders();
            
            // Charging controls
            document.getElementById('charging-start').addEventListener('click', startCharging);
            document.getElementById('charging-stop').addEventListener('click', stopCharging);
            document.getElementById('charging-reset').addEventListener('click', resetCharging);
            
            // Discharging controls
            document.getElementById('discharging-start').addEventListener('click', startDischarging);
            document.getElementById('discharging-stop').addEventListener('click', stopDischarging);
            document.getElementById('discharging-reset').addEventListener('click', resetDischarging);
            
            // Error overlay
            document.getElementById('error-close').addEventListener('click', hideError);
            
            // Initialize slider colors
            document.querySelectorAll('.slider').forEach(slider => {
                slider.dispatchEvent(new Event('input'));
            });
        });
