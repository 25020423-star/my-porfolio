// Initialize Performance Chart
        document.addEventListener('DOMContentLoaded', () => {
            const ctx = document.getElementById('performanceChart').getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Accuracy', 'Latency', 'Precision', 'Recall', 'F1-Score', 'Efficiency'],
                    datasets: [{
                        label: 'Optimized Model',
                        data: [98, 85, 96, 94, 95, 90],
                        fill: true,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: '#3b82f6',
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#3b82f6'
                    }, {
                        label: 'Baseline Model',
                        data: [88, 60, 85, 82, 83, 70],
                        fill: true,
                        backgroundColor: 'rgba(148, 163, 184, 0.2)',
                        borderColor: '#94a3b8',
                        pointBackgroundColor: '#94a3b8',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#94a3b8'
                    }]
                },
                options: {
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255,255,255,0.1)' },
                            grid: { color: 'rgba(255,255,255,0.1)' },
                            pointLabels: { color: '#94a3b8', font: { size: 10 } },
                            ticks: { display: false },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    },
                    plugins: {
                        legend: { labels: { color: '#f8fafc', font: { family: 'Outfit' } } }
                    }
                }
            });
        });

        // Function to filter research items (works with the static featured cards)
        function filterResearch(type, clickedElement) {
            // Remove 'active' class from all filter pills
            document.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
            // Add 'active' class to the clicked pill
            clickedElement?.classList?.add('active');

            // Map filter pill -> research type used by the AI research section
            const typeToResearchType = {
                'all': 'ai',
                'ai': 'ai',
                'deep_learning': 'deep_learning',
                'coding': 'ai'
            };

            const mappedType = typeToResearchType[type] || 'ai';
            currentResearchType = mappedType;

            // Sync research tabs UI
            document.querySelectorAll('.research-tab').forEach(t => {
                const isActive = t.getAttribute('onclick')?.includes(`setResearchType('${mappedType}'`);
                t.classList.toggle('active', isActive);
            });

            // Show/hide featured cards (2 cards exist in current static HTML)
            // If more cards are added later, add data-research-type="ai|deep_learning" to them.
            document.querySelectorAll('.featured-card').forEach(card => {
                const cardType = card.getAttribute('data-research-type');
                if (!cardType) {
                    // default: show all when metadata not present
                    card.style.display = (type === 'all') ? 'flex' : 'flex';
                    return;
                }

                if (type === 'all') {
                    card.style.display = 'flex';
                } else if (type === 'ai') {
                    card.style.display = (cardType === 'ai') ? 'flex' : 'none';
                } else if (type === 'deep_learning') {
                    card.style.display = (cardType === 'deep_learning') ? 'flex' : 'none';
                } else if (type === 'coding') {
                    // treat coding as AI for now
                    card.style.display = (cardType === 'ai') ? 'flex' : 'none';
                } else {
                    card.style.display = 'flex';
                }
            });
        }


        let currentResearchType = 'ai';

        function setResearchType(type, btn) {
            currentResearchType = type;
            document.querySelectorAll('.research-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            const input = document.getElementById('research-input');
            const desc = document.getElementById('research-desc');
            const btnResearch = document.getElementById('btn-research');
            const badge = document.getElementById('research-badge');

            if (type === 'ai') {
                input.placeholder = "Ví dụ: Transformer Architecture, A* Algorithm...";
                desc.innerText = "Nghiên cứu các thuật toán, mô hình và khái niệm khoa học máy tính chuyên sâu.";
                btnResearch.style.background = "linear-gradient(135deg, #3b82f6, #8b5cf6)";
                badge.style.background = "linear-gradient(135deg, #3b82f6, #8b5cf6)";
                badge.innerText = "AI Specialist";
            } else if (type === 'deep_learning') {
                input.placeholder = "Ví dụ: CNN Optimization, GANs for Med-Imaging...";
                desc.innerText = "Phân tích các hệ thống học sâu, hạ tầng phần cứng và tối ưu hóa mô hình.";
                btnResearch.style.background = "linear-gradient(135deg, #10b981, #3b82f6)";
                badge.style.background = "linear-gradient(135deg, #10b981, #3b82f6)";
                badge.innerText = "Deep Learning Expert";
            }
        }

        async function askAIAbout(topic) {
            const input = document.getElementById('terminal-input');
            input.value = `Hãy tóm tắt và phân tích ý nghĩa của nghiên cứu "${topic}" trong lĩnh vực AI hiện nay.`;
            sendChatMessage();
            // Scroll to terminal
            document.querySelector('.ai-terminal').scrollIntoView({ behavior: 'smooth' });
        }

        async function sendChatMessage() {
            const input = document.getElementById('terminal-input');
            const messages = document.getElementById('terminal-messages');
            const prompt = input.value.trim();

            if (!prompt) return;

            // Add user message
            const userDiv = document.createElement('div');
            userDiv.className = 'message user-msg';
            userDiv.innerText = prompt;
            messages.appendChild(userDiv);
            input.value = '';
            messages.scrollTop = messages.scrollHeight;

            // Add loading message
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai-msg';
            loadingDiv.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Đang suy nghĩ...';
            messages.appendChild(loadingDiv);
            messages.scrollTop = messages.scrollHeight;

            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/api/ai/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt })
                });
                const data = await response.json();

                loadingDiv.innerHTML = data.response;
                messages.scrollTop = messages.scrollHeight;
            } catch (error) {
                loadingDiv.innerText = 'Lỗi kết nối. Vui lòng thử lại!';
            }
        }

        async function startResearch() {
            const topic = document.getElementById('research-input').value.trim();
            if (!topic) return;

            const loading = document.getElementById('research-loading');
            const resultPanel = document.getElementById('research-result');
            const resultContent = document.getElementById('research-content');

            loading.style.display = 'flex';
            resultPanel.style.display = 'none';

            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/api/chemistry/research`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic: topic, type: currentResearchType })
                });
                const data = await response.json();

                loading.style.display = 'none';
                resultPanel.style.display = 'block';

                let html = `
                    <div style="grid-column: 1 / -1; margin-bottom: 20px;">
                        <h3 style="color: white; font-size: 1.5rem; border-bottom: 2px solid var(--primary-color); display: inline-block; padding-bottom: 5px;">${topic}</h3>
                    </div>
                `;

                if (currentResearchType === 'ai') {
                    html += `
                        <div class="research-item"><h4 style="color: #3b82f6;"><i class="fa-solid fa-code"></i> Thuật toán</h4><p>${data.overview}</p></div>
                        <div class="research-item"><h4 style="color: #8b5cf6;"><i class="fa-solid fa-microchip"></i> Kiến trúc</h4><p>${data.architecture}</p></div>
                        <div class="research-item"><h4 style="color: #10b981;"><i class="fa-solid fa-laptop-code"></i> Ứng dụng</h4><p>${data.use_cases}</p></div>
                        <div class="research-item"><h4 style="color: #f43f5e;"><i class="fa-solid fa-triangle-exclamation"></i> Thách thức</h4><p>${data.limitations}</p></div>
                    `;
                } else if (currentResearchType === 'deep_learning') {
                    html += `
                        <div class="research-item"><h4 style="color: #10b981;"><i class="fa-solid fa-network-wired"></i> Hệ thống</h4><p>${data.overview}</p></div>
                        <div class="research-item"><h4 style="color: #3b82f6;"><i class="fa-solid fa-gauge-high"></i> Tối ưu hóa</h4><p>${data.optimization}</p></div>
                        <div class="research-item"><h4 style="color: #f59e0b;"><i class="fa-solid fa-server"></i> Hạ tầng</h4><p>${data.hardware}</p></div>
                        <div class="research-item"><h4 style="color: #8b5cf6;"><i class="fa-solid fa-forward"></i> Xu hướng</h4><p>${data.future_trends}</p></div>
                    `;
                }

                resultContent.innerHTML = html;
            } catch (error) {
                loading.style.display = 'none';
                alert("Lỗi kết nối AI Nghiên cứu.");
            }
        }

        function startResearchFromCurrentFilter() {
            // Auto-run research if user already typed a topic.
            const topic = document.getElementById('research-input').value.trim();
            if (!topic) return;
            startResearch();
        }
