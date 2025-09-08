import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { imageUrl, prompt, duration = "8s", generateAudio = true, resolution = "720p" } = body;

    if (!imageUrl) {
      return Response.json({ error: 'Image URL is required' }, { status: 400 });
    }

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('Generating video with VEO 3:', { imageUrl: imageUrl.substring(0, 100) + '...', prompt, duration, resolution });

    const result = await fal.subscribe("fal-ai/veo3/fast/image-to-video", {
      input: {
        prompt: `${prompt} Ensure the video maintains a vertical 9:16 aspect ratio suitable for mobile viewing.`,
        image_url: imageUrl,
        duration,
        generate_audio: generateAudio,
        resolution
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log(`Video generation progress: ${update.status}`);
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    if (!result?.data?.video?.url) {
      throw new Error('No video URL in response');
    }

    return Response.json({
      success: true,
      videoUrl: result.data.video.url,
      requestId: result.requestId
    });

  } catch (error) {
    console.error('Video generation error:', error);
    return Response.json(
      { error: error.message || 'Failed to generate video' }, 
      { status: 500 }
    );
  }
}