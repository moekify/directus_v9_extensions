module.exports = function registerHook({ services, exceptions }) {
  const { MailService } = services;
  const { ServiceUnavailableException } = exceptions;

  return {
    "items.create": async function ({
      event,
      item,
      collection,
      schema,
      payload,
    }) {
      const mailService = new MailService({ schema });
      const subject = 'New ' + collection + ' created';
      const link = 'https://directus.hugrecords.world/admin/collections/' + collection + '/' + item

      if (collection === "artists" || collection === "releases") {
        try {
          await mailService.send({
            subject: subject,
            to: "admin@hugrecords.world",
            template: {
              name: "new-item",
              data: {
                name: payload.name,
                link: link
              },
            },
          });
        } catch (error) {
          throw new ServiceUnavailableException(error);
        }
      }
    },
  };
};
